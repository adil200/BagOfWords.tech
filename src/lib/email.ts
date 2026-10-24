/**
 * Email Dispatcher for Cloudflare
 * Supports Resend API (HTTP REST API, zero external dependencies, works at the Edge)
 * or logging fallback if RESEND_API_KEY is not yet configured.
 */

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'adil@bagofwords.tech';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@bagofwords.tech';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bagofwords.tech';

interface SendMailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Polyfill Uint8Array.prototype.toBase64 if absent in the runtime
if (typeof Uint8Array !== 'undefined' && typeof (Uint8Array.prototype as any).toBase64 !== 'function') {
  (Uint8Array.prototype as any).toBase64 = function () {
    let binary = '';
    const bytes = new Uint8Array(this.buffer, this.byteOffset, this.byteLength);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
}

async function getEmailConfig() {
  let envObj: any = {};
  try {
    const cfContext = (globalThis as any)[Symbol.for('__cloudflare-context__')];
    if (cfContext?.env) {
      envObj = { ...envObj, ...cfContext.env };
    }
  } catch {}

  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx: any = await getCloudflareContext({ async: true });
    if (ctx?.env) {
      envObj = { ...envObj, ...ctx.env };
    }
  } catch {}

  const getVar = (key: string, defaultValue: string = ''): string => {
    return envObj[key] || (typeof process !== 'undefined' && process.env?.[key]) || defaultValue;
  };

  return {
    ownerEmail: getVar('OWNER_EMAIL', 'adil@bagofwords.tech'),
    senderEmail: getVar('SENDER_EMAIL', 'noreply@bagofwords.tech'),
    smtpHost: getVar('SMTP_HOST', 'smtp.larksuite.com'),
    smtpPort: Number(getVar('SMTP_PORT', '465')),
    smtpUser: getVar('SMTP_USER', getVar('SENDER_EMAIL', 'noreply@bagofwords.tech')),
    smtpPassword: getVar('SMTP_PASSWORD', ''),
    resendApiKey: getVar('RESEND_API_KEY', ''),
    siteUrl: getVar('NEXT_PUBLIC_SITE_URL', 'https://bagofwords.tech'),
  };
}

export async function sendEmail({ to, subject, html, text, from }: SendMailParams): Promise<boolean> {
  const config = await getEmailConfig();
  const senderAddress = from || config.senderEmail;
  const recipients = Array.isArray(to) ? to : [to];

  // 1. Try Lark Suite SMTP (Port 465 SSL/TLS via Cloudflare Worker Sockets)
  if (config.smtpPassword) {
    try {
      const { WorkerMailer } = await import('worker-mailer');

      await WorkerMailer.send(
        {
          host: config.smtpHost,
          port: config.smtpPort,
          secure: true,
          authType: ['login', 'plain'],
          credentials: {
            username: config.smtpUser,
            password: config.smtpPassword,
          },
        },
        {
          from: { name: 'BagOfWords', email: senderAddress },
          to: recipients,
          subject,
          html,
          text,
        }
      );

      console.log(`[Lark Suite SMTP] Email sent successfully to: ${recipients.join(', ')}`);
      return true;
    } catch (smtpErr: any) {
      console.error('[Lark Suite SMTP Error]', smtpErr?.message || smtpErr);
      // Fall through to Resend or Mock if SMTP fails
    }
  } else {
    console.warn('[Lark Suite SMTP] SMTP_PASSWORD is not configured in environment or Cloudflare secrets.');
  }

  // 2. Try Resend HTTP API
  if (config.resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `BagOfWords <${senderAddress}>`,
          to: recipients,
          subject,
          html,
          text,
        }),
      });

      if (!res.ok) {
        const errData = await res.text();
        console.error('[Resend Error]', res.status, errData);
        return false;
      }

      console.log(`[Resend API] Email sent successfully via HTTP`);
      return true;
    } catch (err) {
      console.error('[Resend API Error]', err);
      return false;
    }
  }

  // 3. Fallback: Mock logging for local development or when credentials are not configured
  console.log(`[Email Mock] Neither SMTP_PASSWORD nor RESEND_API_KEY configured. Simulated send:
    To: ${recipients.join(', ')}
    Subject: ${subject}
    From: ${senderAddress}`);
  return true;
}

/**
 * 1. Notification to owner on contact form submission
 */
export async function sendContactNotification(name: string, email: string, message: string, id: string) {
  const subject = `New Contact Form Submission from ${name}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #00CFDE 0%, #008899 100%); padding: 28px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 22px;">New Contact Submission</h1>
          <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">BagOfWords.tech Contact Form</p>
        </div>
        <div style="padding: 28px 24px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #00CFDE;">${email}</a></p>
          <p><strong>Submission ID:</strong> <code>${id}</code></p>
          <h3 style="margin-top: 20px; font-size: 16px; color: #1e293b;">Message:</h3>
          <div style="background: #f1f5f9; padding: 16px; border-left: 4px solid #00CFDE; border-radius: 6px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #334155;">
${message}
          </div>
          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${email}?subject=Re: Your message to BagOfWords" style="display: inline-block; padding: 12px 28px; background: #00CFDE; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Reply to ${name}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: OWNER_EMAIL,
    subject,
    html,
  });
}

/**
 * 2. Welcome email to newly subscribed user
 */
export async function sendWelcomeEmail(email: string, name?: string) {
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const displayName = name || email.split('@')[0];
  const subject = 'Welcome to BagOfWords! 🎉';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc;">
      <div style="max-width: 580px; margin: 0 auto; background: #1e293b; border-radius: 14px; border: 1px solid #334155; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #00CFDE 0%, #008899 100%); padding: 36px 28px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800;">BagOfWords</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 15px;">Demystifying AI, Machine Learning, and NLP</p>
        </div>
        <div style="padding: 32px 28px; line-height: 1.7; color: #e2e8f0;">
          <p style="font-size: 17px; margin-top: 0;">Hey <strong>${displayName}</strong>,</p>
          <p>Thank you for subscribing to the <strong>BagOfWords</strong> newsletter! We break down cutting-edge Artificial Intelligence, deep technical guides, and practical machine learning insights into clear, actionable articles.</p>
          <p>Here's what you can expect:</p>
          <ul style="padding-left: 20px; color: #cbd5e1;">
            <li>Deep dives into modern foundation models (LLMs, Diffusion, Imagen).</li>
            <li>Hands-on tutorials on NLP architectures and Python libraries.</li>
            <li>Zero fluff, high-signal technical content.</li>
          </ul>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${SITE_URL}/articles" style="display: inline-block; padding: 14px 32px; background: #00CFDE; color: #0f172a; font-weight: 700; text-decoration: none; border-radius: 8px;">Explore Recent Articles</a>
          </div>
          <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 20px; margin-top: 32px;">
            You received this because you subscribed at <a href="${SITE_URL}" style="color: #00CFDE;">bagofwords.tech</a>.<br/>
            Want to unsubscribe? <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline;">Click here to unsubscribe</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * 3. Alert owner about a new subscriber
 */
export async function sendNewSubscriberAlert(email: string) {
  const subject = `🎉 New Subscriber: ${email}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>🎉 New Subscriber Joined!</h2>
      <p>A new user just subscribed to the BagOfWords newsletter:</p>
      <p style="font-size: 18px; font-weight: bold; color: #00CFDE;">${email}</p>
      <p style="color: #64748b; font-size: 13px;">Time: ${new Date().toISOString()}</p>
    </div>
  `;

  return sendEmail({
    to: OWNER_EMAIL,
    subject,
    html,
  });
}
