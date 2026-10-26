'use server';

import { executeD1Query } from '@/lib/db';
import { sendContactNotification, sendWelcomeEmail, sendNewSubscriberAlert } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';
import type { Comment } from '@/types';

/**
 * Subscribes a user to the newsletter via Cloudflare D1 and sends a welcome email.
 */
export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email')?.toString().trim().toLowerCase();

    if (!email) {
      return { success: false, message: 'Email is required' };
    }

    const checkRes = await executeD1Query('SELECT id FROM newsletter WHERE email = ?', [email]);
    if (checkRes.success && checkRes.results.length > 0) {
      return {
        success: true,
        message: 'You are already subscribed to our newsletter!',
      };
    }

    const id = uuidv4();
    const insertRes = await executeD1Query(
      'INSERT INTO newsletter (id, email, status) VALUES (?, ?, ?)',
      [id, email, 'active']
    );

    if (!insertRes.success) {
      return {
        success: false,
        message: 'Failed to record subscription. Please try again.',
      };
    }

    const name = email.split('@')[0];
    await Promise.all([
      sendWelcomeEmail(email, name),
      sendNewSubscriberAlert(email),
    ]).catch((err) => console.error('[Subscription Email Error]', err));

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    };
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Backward compatibility alias for subscribeToNewsletter.
 */
export async function subscribeToNewsletter1(prevState: any, formData: FormData) {
  return subscribeToNewsletter(prevState, formData);
}

/**
 * Submits a contact form submission to Cloudflare D1 and triggers email notification.
 */
export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const message = (formData.get('message') as string)?.trim();

    if (!name || !email || !message) {
      return { success: false, message: 'All fields are required' };
    }

    const id = uuidv4();
    const insertRes = await executeD1Query(
      'INSERT INTO contacts (id, name, email, message, status) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, message, 'new']
    );

    if (!insertRes.success) {
      return { success: false, message: 'Failed to submit contact form. Please try again.' };
    }

    await sendContactNotification(name, email, message, id).catch((err) =>
      console.error('[Contact Form Notification Error]', err)
    );

    return { success: true, message: 'Contact form submitted successfully', id };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { success: false, message: 'Failed to submit contact form. Please try again.' };
  }
}

/**
 * Inserts a new comment into the Cloudflare D1 comments table.
 */
export async function addCommentToAppwrite(
  articleSlug: string,
  content: string,
  authorName: string,
  authorAvatar?: string,
  parentId?: string | null,
  isAuthor?: boolean
) {
  try {
    const id = uuidv4();
    const res = await executeD1Query(
      `INSERT INTO comments (id, article_slug, content, author_name, author_avatar, parent_id, is_author)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, articleSlug, content, authorName, authorAvatar || '', parentId || null, isAuthor ? 1 : 0]
    );

    if (!res.success) {
      return { success: false, message: 'Failed to add comment. Please try again.' };
    }

    return { success: true, message: 'Comment added successfully' };
  } catch (error) {
    console.error('Add comment error:', error);
    return { success: false, message: 'Failed to add comment. Please try again.' };
  }
}

/**
 * Fetches all comments for an article and builds a hierarchical threaded comment tree.
 */
export async function getCommentsFromAppwrite(articleSlug: string): Promise<Comment[]> {
  try {
    const res = await executeD1Query(
      'SELECT * FROM comments WHERE article_slug = ? ORDER BY created_at DESC',
      [articleSlug]
    );

    if (!res.success) {
      return [];
    }

    const comments: Comment[] = res.results.map((row: any) => ({
      id: row.id,
      content: row.content,
      author: {
        name: row.author_name,
        avatarUrl: row.author_avatar || undefined,
      },
      timestamp: row.created_at,
      upvotes: Number(row.upvotes) || 0,
      downvotes: Number(row.downvotes) || 0,
      parentId: row.parent_id || null,
      isAuthor: Boolean(row.is_author),
      replies: [],
    }));

    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  } catch (error) {
    console.error('Get comments error:', error);
    return [];
  }
}

/**
 * Increments upvote count for a comment in Cloudflare D1.
 */
export async function upvoteComment(commentId: string) {
  try {
    const res = await executeD1Query(
      'UPDATE comments SET upvotes = upvotes + 1 WHERE id = ?',
      [commentId]
    );

    if (!res.success) {
      return { success: false, message: 'Failed to upvote comment.' };
    }

    return { success: true, message: 'Comment upvoted!' };
  } catch (error) {
    console.error('Upvote error:', error);
    return { success: false, message: 'Failed to upvote comment.' };
  }
}

/**
 * Increments downvote count for a comment in Cloudflare D1.
 */
export async function downvoteComment(commentId: string) {
  try {
    const res = await executeD1Query(
      'UPDATE comments SET downvotes = downvotes + 1 WHERE id = ?',
      [commentId]
    );

    if (!res.success) {
      return { success: false, message: 'Failed to downvote comment.' };
    }

    return { success: true, message: 'Comment downvoted!' };
  } catch (error) {
    console.error('Downvote error:', error);
    return { success: false, message: 'Failed to downvote comment.' };
  }
}

/**
 * Generates an article summary using Google Gemini models with Cloudflare Workers AI fallback.
 */
export async function generateArticleSummaryAction(articleContent: string): Promise<{ summary?: string; error?: string }> {
  if (!articleContent.trim()) {
    return { error: 'Article content cannot be empty.' };
  }

  const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
  const prompt = `Please provide a concise summary of the following article content. Focus on the main points and key information:\n\n${articleContent}\n\nSummary:`;

  const apiKey = process.env.GOOGLE_API_KEY;
  let lastError: any = null;

  if (apiKey) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of MODELS) {
      try {
        console.log(`[generateArticleSummaryAction] Trying Gemini model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        if (summary && summary.trim()) {
          console.log(`[generateArticleSummaryAction] Summary generated with ${modelName}, length:`, summary.length);
          return { summary: summary.trim() };
        } else {
          lastError = new Error('Empty response from model.');
        }
      } catch (err: any) {
        lastError = err;
        const isLocationError = err.message?.includes('User location is not supported');
        const is503 =
          err.message?.includes('503') ||
          err.message?.includes('Service Unavailable') ||
          err.message?.includes('high demand');
        console.warn(`[generateArticleSummaryAction] Model ${modelName} failed${is503 ? ' (503 – retrying with fallback)' : ''}:`, err.message);
        if (isLocationError) {
          break;
        }
        if (!is503) break;
      }
    }
  } else {
    lastError = new Error('GOOGLE_API_KEY is not configured in environment variables.');
  }

  try {
    const cfContext = (globalThis as any)[Symbol.for('__cloudflare-context__')];
    let aiBinding = cfContext?.env?.AI;

    if (!aiBinding) {
      try {
        const { getCloudflareContext } = await import('@opennextjs/cloudflare');
        const ctx = await getCloudflareContext({ async: true });
        aiBinding = (ctx?.env as any)?.AI;
      } catch {}
    }

    if (aiBinding && typeof aiBinding.run === 'function') {
      console.log('[generateArticleSummaryAction] Falling back to Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct)...');
      const aiRes: any = await aiBinding.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt: `Please provide a concise summary of the following article content. Focus on the main points and key information:\n\n${articleContent}\n\nSummary:`,
        max_tokens: 500,
      });
      const cfSummary = aiRes?.response?.trim();
      if (cfSummary) {
        console.log('[generateArticleSummaryAction] Summary successfully generated via Cloudflare Workers AI');
        return { summary: cfSummary };
      }
    }
  } catch (cfAiErr: any) {
    console.warn('[generateArticleSummaryAction] Cloudflare Workers AI fallback failed:', cfAiErr.message);
  }

  console.error('[generateArticleSummaryAction] All summary generation methods failed:', lastError);
  let errorMessage = 'An error occurred while generating the summary.';
  if (lastError?.message?.includes('User location is not supported')) {
    errorMessage = 'Google Gemini API blocked this server location ("User location is not supported for the API use"). Cloudflare Workers Smart Placement has been configured to route requests through supported regions.';
  } else if (lastError?.message) {
    errorMessage += ` Details: ${lastError.message}`;
  }
  return { error: errorMessage };
}

