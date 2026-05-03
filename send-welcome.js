import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Allow requests from your Firebase domain
  res.setHeader('Access-Control-Allow-Origin', 'https://www.unitywealth.name.ng');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { firstName, email, refCode, planLabel, portalUrl } = req.body;

  // Basic validation
  if (!firstName || !email || !refCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'Unity Wealth <noreply@unitywealth.name.ng>',  // Must match your verified Resend domain
      to: email,
      subject: '🎉 Welcome to Unity Wealth Cooperative!',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Unity Wealth</title>
</head>
<body style="margin:0;padding:0;background:#FBF7F0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#08192e,#0F2A4A);padding:32px 40px;text-align:center;">
              <div style="width:52px;height:52px;background:linear-gradient(135deg,#B8912E,#D4AF37);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                <span style="font-size:1.2rem;font-weight:900;color:#fff;font-family:Georgia,serif;">UW</span>
              </div>
              <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:1.5rem;font-weight:700;">Unity Wealth</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.55);font-size:0.75rem;letter-spacing:0.05em;">Cooperative Society</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#0F2A4A;font-family:Georgia,serif;font-size:1.6rem;">Welcome, ${firstName}! 🎉</h2>
              <p style="color:#666;font-size:0.95rem;line-height:1.7;margin:0 0 24px;">
                Your registration has been received. Our admin team will review and activate your account within <strong>24 hours</strong>.
                You'll be notified once your account is live.
              </p>

              <!-- Ref Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0F2A4A,#1a3a5c);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 6px;color:rgba(255,255,255,0.6);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;">Your Referral Code</p>
                    <p style="margin:0 0 4px;color:#D4AF37;font-size:1.8rem;font-weight:700;letter-spacing:0.1em;">${refCode}</p>
                    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:0.75rem;">Share this code and earn ₦10,000 per referral</p>
                  </td>
                </tr>
              </table>

              <!-- Plan -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5dece;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #e5dece;">
                    <span style="color:#999;font-size:0.78rem;text-transform:uppercase;font-weight:600;">Your Plan</span>
                    <span style="float:right;color:#0F2A4A;font-weight:700;">${planLabel}</span>
                  </td>
                  <td style="display:none;"></td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <span style="color:#999;font-size:0.78rem;text-transform:uppercase;font-weight:600;">Account Status</span>
                    <span style="float:right;color:#B8912E;font-weight:700;">Pending Activation</span>
                  </td>
                  <td style="display:none;"></td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${portalUrl}" style="display:inline-block;background:linear-gradient(135deg,#B8912E,#D4AF37);color:#fff;text-decoration:none;padding:14px 40px;border-radius:10px;font-weight:700;font-size:0.95rem;">
                      Go to Member Portal →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f0e8;padding:24px 40px;text-align:center;border-top:1px solid #e5dece;">
              <p style="margin:0 0 6px;color:#999;font-size:0.78rem;">Questions? Reply to this email or contact us at</p>
              <a href="mailto:unitywealth0@gmail.com" style="color:#B8912E;font-size:0.82rem;font-weight:600;">unitywealth0@gmail.com</a>
              <p style="margin:12px 0 0;color:#bbb;font-size:0.72rem;">© 2025 Unity Wealth Cooperative Society. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
