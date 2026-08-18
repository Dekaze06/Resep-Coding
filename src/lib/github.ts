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

export async function validateGitHubToken(token: string): Promise<{ valid: boolean; username?: string; error?: string }> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
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
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Satusite-Studio-App',
    'Content-Type': 'application/json'
  };

  try {
    // 1. Get user profile to determine owner
    const userRes = await fetch('https://api.github.com/user', { headers: authHeaders });
    if (!userRes.ok) {
      return { success: false, error: 'Otentikasi token GitHub gagal.' };
    }
    const user = await userRes.json();
    const owner = user.login;

    // 2. Check if repo exists or create it
    let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers: authHeaders });
    if (!repoRes.ok && repoRes.status === 404) {
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
      repoRes = createRes;
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || 'main';

    // 3. Put / commit each file using Contents API
    for (const f of files) {
      // Check if file exists to get SHA
      let sha: string | undefined = undefined;
      const fileCheck = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${f.path}`, {
        headers: authHeaders
      });
      if (fileCheck.ok) {
        const fileInfo = await fileCheck.json();
        sha = fileInfo.sha;
      }

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
        console.warn(`[GitHub Push] Warning on file ${f.path}:`, putErr);
      }
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
