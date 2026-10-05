export interface GitHubPushPayload {
  token: string;
  repoName: string;
  isPrivate?: boolean;
  commitMessage: string;
  files: {
    path: string;
    content: string;
  }[];
}

export interface GitHubPushResult {
  success: boolean;
  repoUrl?: string;
  commitUrl?: string;
  error?: string;
}

function getGitHubAuthHeader(rawToken: string): string {
  const token = (rawToken || '').trim();
  if (token.startsWith('Bearer ') || token.startsWith('token ')) {
    return token;
  }
  if (token.startsWith('github_pat_')) {
    return `Bearer ${token}`;
  }
  return `token ${token}`;
}

export async function validateGitHubToken(token: string): Promise<{ valid: boolean; username?: string; error?: string }> {
  try {
    const authHeader = getGitHubAuthHeader(token);
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Satusite-Studio-App'
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { valid: false, error: err.message || 'Token GitHub tidak valid atau telah kedaluwarsa.' };
    }

    const data = await res.json();
    return { valid: true, username: data.login };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Gagal terhubung ke GitHub API.' };
  }
}

export async function pushToGitHub(payload: GitHubPushPayload): Promise<GitHubPushResult> {
  const { token, repoName, isPrivate = false, commitMessage, files } = payload;
  const authHeader = getGitHubAuthHeader(token);
  const authHeaders = {
    'Authorization': authHeader,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Satusite-Studio-App',
    'Content-Type': 'application/json'
  };

  try {
    // 1. Get user profile to determine owner
    const userRes = await fetch('https://api.github.com/user', { headers: authHeaders });
    if (!userRes.ok) {
      const userErr = await userRes.json().catch(() => ({}));
      return { success: false, error: userErr.message || 'Otentikasi token GitHub gagal. Pastikan token memiliki scope "repo".' };
    }
    const user = await userRes.json();
    const owner = user.login;

    // 2. Check if repo exists or create it
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers: authHeaders });
    let repoData: any = null;

    if (repoRes.ok) {
      repoData = await repoRes.json();
    } else if (repoRes.status === 404) {
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: repoName,
          private: isPrivate,
          auto_init: true,
          description: 'Aplikasi web mandiri dibuat otomatis dengan SATUSITE STUDIO AI Agent.'
        })
      });
      if (!createRes.ok) {
        const createErr = await createRes.json().catch(() => ({}));
        return { success: false, error: createErr.message || 'Gagal membuat repositori GitHub baru.' };
      }
      repoData = await createRes.json();
      // Wait for GitHub async repo initialization
      await new Promise(r => setTimeout(r, 1500));
    } else {
      const repoErr = await repoRes.json().catch(() => ({}));
      return { success: false, error: repoErr.message || 'Gagal memeriksa repositori GitHub.' };
    }

    const defaultBranch = repoData.default_branch || 'main';

    // 3. Put / commit each file using Contents API
    let uploadFailures: string[] = [];
    for (const f of files) {
      let sha: string | undefined = undefined;
      try {
        const fileCheck = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${f.path}?ref=${defaultBranch}`, {
          headers: authHeaders
        });
        if (fileCheck.ok) {
          const fileInfo = await fileCheck.json();
          sha = fileInfo.sha;
        }
      } catch (e) {}

      const contentBase64 = Buffer.from(f.content, 'utf8').toString('base64');
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${f.path}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          message: `${commitMessage} (${f.path})`,
          content: contentBase64,
          branch: defaultBranch,
          ...(sha ? { sha } : {})
        })
      });

      if (!putRes.ok) {
        const putErr = await putRes.json().catch(() => ({}));
        uploadFailures.push(`${f.path}: ${putErr.message || 'Error'}`);
      }
    }

    if (uploadFailures.length > 0 && uploadFailures.length === files.length) {
      return {
        success: false,
        error: `Gagal mengunggah berkas ke repositori: ${uploadFailures.join(', ')}`
      };
    }

    return {
      success: true,
      repoUrl: repoData.html_url,
      commitUrl: `${repoData.html_url}/tree/${defaultBranch}`
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Terjadi kesalahan saat melakukan sinkronisasi ke GitHub.' };
  }
}
