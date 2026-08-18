import { Resend } from 'resend';
import nodemailer from 'nodemailer';

function getGmailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass || pass.startsWith('YOUR_') || pass.length < 8) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.replace(/\s+/g, '').trim() // cleans spaces in 16-char app password
    }
  });
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith('re_placeholder') || apiKey === 'YOUR_RESEND_API_KEY') {
    return null;
  }
  return new Resend(apiKey);
}

export interface SendVerificationEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({ to, name, verificationUrl }: SendVerificationEmailParams): Promise<{ success: boolean; verificationUrl?: string; messageId?: string; error?: string }> {
  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Akun satusitE</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #121215; border: 1px solid #27272a; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #1f1f23;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-size: 16px; font-weight: 700; letter-spacing: 0.25em; color: #ffffff;">satusitE</span>
                    <span style="color: #71717a; font-size: 11px; margin-left: 8px; font-family: monospace;">// STUDIO AI</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">
                Verifikasi Alamat Email Anda
              </h1>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                Halo <strong style="color: #ffffff;">${name || 'Klien'}</strong>, terima kasih telah mendaftar di <strong>satusitE Studio</strong>. Untuk mengamankan akun dan mulai menghasilkan aplikasi fullstack dengan AI Engine, silakan konfirmasi alamat email Anda.
              </p>

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #09090b; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 10px; box-shadow: 0 4px 12px rgba(255,255,255,0.1);">
                      Verifikasi Akun Saya &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 12px; line-height: 1.5; color: #71717a;">
                Jika tombol di atas tidak dapat diklik, salin dan tempel tautan berikut ke peramban (*browser*) Anda:
              </p>
              <div style="padding: 12px; background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; font-size: 11px; font-family: monospace; color: #d4d4d8; word-break: break-all; margin-bottom: 24px;">
                ${verificationUrl}
              </div>

              <div style="border-top: 1px solid #1f1f23; padding-top: 20px;">
                <p style="margin: 0; font-size: 11px; color: #52525b; line-height: 1.5;">
                  ⏱️ <em>Tautan verifikasi ini hanya berlaku selama 24 jam.</em><br>
                  Jika Anda tidak pernah merasa mendaftar di satusitE, abaikan email ini dengan aman.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #09090b; border-top: 1px solid #1f1f23; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #52525b;">
                &copy; 2026 satusitE Technologies. Next-Gen Autonomous Web Engine.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const gmailTransporter = getGmailTransporter();
  const resend = getResendClient();

  // 1. Primary Priority: Gmail SMTP (No Custom Domain Required!)
  if (gmailTransporter) {
    try {
      const fromUser = process.env.GMAIL_USER?.trim();
      const mailOptions = {
        from: `satusitE Studio <${fromUser}>`,
        to,
        subject: 'Konfirmasi Verifikasi Akun satusitE Anda',
        html: htmlContent
      };

      const info = await gmailTransporter.sendMail(mailOptions);
      console.log('\n======================================================');
      console.log('[GMAIL SMTP DISPATCH SUCCESS]');
      console.log(`To: ${to}`);
      console.log(`Message ID: ${info.messageId}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('======================================================\n');

      return {
        success: true,
        verificationUrl,
        messageId: info.messageId
      };
    } catch (err: any) {
      console.error('[Gmail SMTP Error]:', err);
    }
  }

  // 2. Secondary Priority: Resend Cloud API
  if (resend) {
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'satusitE <onboarding@resend.dev>';
      const response = await resend.emails.send({
        from: fromAddress,
        to,
        subject: 'Konfirmasi Verifikasi Akun satusitE Anda',
        html: htmlContent
      });

      console.log('\n======================================================');
      console.log('[RESEND EMAIL DISPATCH ATTEMPT]');
      console.log(`To: ${to}`);
      console.log(`Verification Link: ${verificationUrl}`);
      if (response.error) {
        console.log(`Resend Error: ${response.error.message}`);
      } else {
        console.log(`Resend Success ID: ${response.data?.id}`);
      }
      console.log('======================================================\n');

      if (response.error) {
        return {
          success: false,
          verificationUrl,
          error: response.error.message || 'Gagal mengirim email verifikasi.'
        };
      }

      return {
        success: true,
        verificationUrl,
        messageId: response.data?.id
      };
    } catch (err: any) {
      console.error('[Resend Exception]', err);
      return {
        success: false,
        verificationUrl,
        error: err.message || 'Gagal mengirim email verifikasi.'
      };
    }
  }

  // 3. Fallback: Development Simulation
  console.log('\n======================================================');
  console.log('[DEV EMAIL SIMULATION - NO SMTP / RESEND KEY]');
  console.log(`To: ${to}`);
  console.log(`Verification URL: ${verificationUrl}`);
  console.log('======================================================\n');
  return {
    success: true,
    verificationUrl,
    messageId: `sim_${Date.now()}`
  };
}
