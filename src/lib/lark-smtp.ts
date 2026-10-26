interface SendLarkMailOptions {
  host?: string;
  port?: number;
  username: string;
  password: string;
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Safely converts a UTF-8 string to a base64 encoded string.
 */
function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Encodes an email subject header using MIME UTF-8 Q-encoding when non-ASCII characters exist.
 */
function encodeSubject(subject: string): string {
  if (!/[^\x00-\x7F]/.test(subject)) {
    return subject;
  }
  const bytes = new TextEncoder().encode(subject);
  let encoded = '';
  for (const b of bytes) {
    if (b >= 33 && b <= 126 && b !== 63 && b !== 61 && b !== 95) {
      encoded += String.fromCharCode(b);
    } else if (b === 32) {
      encoded += '_';
    } else {
      encoded += `=${b.toString(16).toUpperCase().padStart(2, '0')}`;
    }
  }
  return `=?UTF-8?Q?${encoded}?=`;
}

/**
 * Sends an email using Cloudflare TCP sockets to connect directly to Lark Suite SMTP.
 */
export async function sendLarkMail({
  host = 'smtp.larksuite.com',
  port = 465,
  username,
  password,
  from,
  to,
  subject,
  html,
  text,
}: SendLarkMailOptions): Promise<boolean> {
  const recipients = Array.isArray(to) ? to : [to];
  const socketModulePath = 'cloudflare:sockets';
  let connectFn: any;
  try {
    const sockets = await import(/* webpackIgnore: true */ socketModulePath);
    connectFn = sockets.connect;
  } catch (err: any) {
    console.error('[Lark SMTP] Could not load cloudflare:sockets runtime module:', err?.message || err);
    throw new Error('cloudflare:sockets is only available in Cloudflare Workers runtime.');
  }

  if (typeof connectFn !== 'function') {
    throw new Error('connect function not found in cloudflare:sockets');
  }

  console.log(`[Lark SMTP] Connecting to ${host}:${port} (SSL/TLS)...`);
  const socket = connectFn(
    { hostname: host, port },
    { secureTransport: 'on', allowHalfOpen: false }
  );

  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const decoder = new TextDecoder('utf-8');
  const encoder = new TextEncoder();

  async function readReply(expectedCode: string): Promise<string> {
    let response = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) throw new Error('SMTP connection closed prematurely by server');
      response += decoder.decode(value, { stream: true });
      const lines = response.split(/\r?\n/);
      const lastLine = lines.filter((l: string) => l.trim().length > 0).pop() || '';
      if (/^\d{3}\s/.test(lastLine)) {
        if (!lastLine.startsWith(expectedCode)) {
          throw new Error(`SMTP Error (expected ${expectedCode}): ${lastLine}`);
        }
        return response;
      }
    }
  }

  async function sendCommand(cmd: string, expectedCode: string): Promise<string> {
    await writer.write(encoder.encode(cmd + '\r\n'));
    return readReply(expectedCode);
  }

  try {
    await readReply('220');
    await sendCommand('EHLO bagofwords.tech', '250');
    await sendCommand('AUTH LOGIN', '334');
    await sendCommand(toBase64(username), '334');
    await sendCommand(toBase64(password), '235');
    await sendCommand(`MAIL FROM:<${from}>`, '250');

    for (const recipient of recipients) {
      await sendCommand(`RCPT TO:<${recipient}>`, '250');
    }

    await sendCommand('DATA', '354');

    const boundary = `====_NextPart_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const headers = [
      `From: "BagOfWords" <${from}>`,
      `To: ${recipients.join(', ')}`,
      `Subject: ${encodeSubject(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${Date.now()}@bagofwords.tech>`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ];

    const bodyParts: string[] = [];
    if (text) {
      bodyParts.push(
        `--${boundary}\r\n` +
        'Content-Type: text/plain; charset=UTF-8\r\n' +
        'Content-Transfer-Encoding: 8bit\r\n\r\n' +
        text
      );
    }
    bodyParts.push(
      `--${boundary}\r\n` +
      'Content-Type: text/html; charset=UTF-8\r\n' +
      'Content-Transfer-Encoding: 8bit\r\n\r\n' +
      html
    );
    bodyParts.push(`--${boundary}--`);

    const fullMessage = headers.join('\r\n') + '\r\n\r\n' + bodyParts.join('\r\n\r\n') + '\r\n.\r\n';

    await writer.write(encoder.encode(fullMessage));
    await readReply('250');
    await sendCommand('QUIT', '221').catch(() => {});

    console.log(`[Lark Suite SMTP] Email sent successfully to: ${recipients.join(', ')}`);
    return true;
  } catch (err: any) {
    console.error('[Lark Suite SMTP Error]', err?.message || err);
    throw err;
  } finally {
    try {
      reader.releaseLock();
      writer.releaseLock();
      await socket.close();
    } catch {}
  }
}
