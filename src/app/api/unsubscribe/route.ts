import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';

const DATABASE_ID           = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const NEWSLETTER_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID!;

/**
 * GET /api/unsubscribe?email=<email>
 *
 * Called when a user clicks the "Unsubscribe" link in their welcome email.
 * 1. Deletes the subscriber row from the newsletter collection.
 * 2. Returns a branded HTML success page.
 * 3. The Appwrite welcome_mail_ function will send adil@bagofwords.tech a
 *    notification (this route handles it on the Next.js side so we don't need
 *    to expose the raw Appwrite function URL in the email).
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim();

    if (!email) {
        return new NextResponse(errorPage('No email address provided.'), {
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    }

    let deleted = false;

    try {
        const existing = await serverDatabases.listDocuments(
            DATABASE_ID,
            NEWSLETTER_COLLECTION,
            [Query.equal('email', email)]
        );

        if (existing.total > 0) {
            const docId = existing.documents[0].$id;
            await serverDatabases.deleteDocument(DATABASE_ID, NEWSLETTER_COLLECTION, docId);
            deleted = true;
            console.log(`[unsubscribe] Deleted subscriber ${email} (doc: ${docId})`);
        } else {
            console.log(`[unsubscribe] No record found for ${email}`);
        }
    } catch (err) {
        console.error('[unsubscribe] DB error:', err);
        // Still show success to user — don't expose internals
    }

    // Fire-and-forget: notify adil@bagofwords.tech via welcome_mail_ function
    try {
        const functionEndpoint  = process.env.APPWRITE_FUNCTION_ENDPOINT;
        const apiKey            = process.env.APPWRITE_API_KEY;
        const functionId        = process.env.WELCOME_MAIL_FUNCTION_ID;

        if (functionEndpoint && apiKey && functionId) {
            // Trigger unsubscribe path inside the Appwrite function
            fetch(
                `${functionEndpoint}/v1/functions/${functionId}/executions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
                        'X-Appwrite-Key': apiKey,
                    },
                    // Pass a special flag so the function knows this is an unsubscribe
                    body: JSON.stringify({
                        _action: 'unsubscribe',
                        email,
                        deleted,
                    }),
                }
            ).catch(e => console.error('[unsubscribe] notify error:', e));
        }
    } catch (_) { /* non-critical */ }

    return new NextResponse(successPage(email), {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}

// ── HTML pages ────────────────────────────────────────────────────────────────

function successPage(email: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribed — BagOfWords</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f4f4f4;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 0 30px rgba(0,0,0,0.12);
            max-width: 480px;
            width: 90%;
            overflow: hidden;
            text-align: center;
        }
        .header {
            background: linear-gradient(135deg, #00CFDE 0%, #00A8B5 100%);
            padding: 40px 30px;
        }
        .header h1 { color: #fff; font-size: 28px; margin-bottom: 8px; }
        .header p  { color: rgba(255,255,255,0.85); font-size: 14px; }
        .body { padding: 40px 30px; }
        .checkmark {
            width: 64px; height: 64px;
            background: linear-gradient(135deg, #00CFDE, #00A8B5);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px auto;
            font-size: 30px;
        }
        .body h2 { color: #333; font-size: 22px; margin-bottom: 12px; }
        .body p  { color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
        .email-badge {
            display: inline-block;
            background: #f0fdfe;
            color: #00A8B5;
            border: 1px solid #00CFDE;
            border-radius: 20px;
            padding: 4px 16px;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 12px 36px;
            background: linear-gradient(135deg, #00CFDE 0%, #00A8B5 100%);
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            font-size: 15px;
            font-weight: bold;
        }
        .footer { padding: 20px 30px; background: #f8f9fa; border-top: 1px solid #e9ecef; }
        .footer p { color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>BagOfWords</h1>
            <p>Your Guide to AI, ML, and NLP</p>
        </div>
        <div class="body">
            <div class="checkmark">✅</div>
            <h2>Successfully Unsubscribed</h2>
            <span class="email-badge">${email}</span>
            <p>
                You've been removed from the BagOfWords newsletter.<br>
                You won't receive any more emails from us.
            </p>
            <p style="font-size: 13px; color: #999; margin-bottom: 24px;">
                Changed your mind? You can always resubscribe on the website.
            </p>
            <a href="https://bagofwords.tech" class="btn">Back to BagOfWords</a>
        </div>
        <div class="footer">
            <p>© 2026 BagOfWords. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}

function errorPage(message: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Unsubscribe Error — BagOfWords</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4;
               display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: #fff; border-radius: 12px; padding: 40px; max-width: 400px;
                text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        h2 { color: #e74c3c; margin-bottom: 12px; }
        p { color: #666; }
        a { color: #00CFDE; }
    </style>
</head>
<body>
    <div class="card">
        <h2>⚠️ Unsubscribe Error</h2>
        <p>${message}</p>
        <p style="margin-top:20px;"><a href="https://bagofwords.tech">Back to BagOfWords</a></p>
    </div>
</body>
</html>`;
}
