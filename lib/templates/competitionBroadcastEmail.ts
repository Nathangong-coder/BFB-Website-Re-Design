/**
 * CAN-SPAM Compliant Broadcast Email Template for BFB Alpha Research Competition
 * Includes mandatory physical mailing address, opt-out disclaimer, and 1-click unsubscribe link.
 */

export interface BroadcastEmailParams {
  recipientName: string;
  subject: string;
  htmlBody: string;
  unsubscribeUrl?: string;
}

export function generateBroadcastEmailHtml({
  recipientName,
  subject,
  htmlBody,
  unsubscribeUrl = "https://bfbatucla.com/contact?unsubscribe=true",
}: BroadcastEmailParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 20px auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 24px; background-color: #0f172a; border-bottom: 1px solid #1e293b; text-align: center;">
        <h2 style="margin: 0; color: #3b82f6; font-size: 20px; font-weight: 700;">Blockchain at UCLA</h2>
        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; tracking-wider: 1px;">Alpha Research Competition</p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 32px; line-height: 1.6; color: #cbd5e1; font-size: 14px;">
        <p style="margin-top: 0;">Hi ${recipientName},</p>
        <div>
          ${htmlBody}
        </div>
        <p style="margin-bottom: 0;">Best regards,<br><strong>BFB Competition Organizing Committee</strong></p>
      </td>
    </tr>

    <!-- CAN-SPAM Required Compliance Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #090d16; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center; line-height: 1.5;">
        <p style="margin: 0 0 8px 0;">
          You are receiving this official announcement because your email address was registered for the BFB Alpha Research Competition.
        </p>
        <p style="margin: 0 0 8px 0;">
          <strong>Blockchain at UCLA</strong> | Associated Students UCLA | 308 Westwood Plaza, Los Angeles, CA 90024
        </p>
        <p style="margin: 0;">
          If you received this message by mistake or wish to stop receiving competition updates, <a href="${unsubscribeUrl}" style="color: #3b82f6; text-decoration: underline;">click here to unsubscribe</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
