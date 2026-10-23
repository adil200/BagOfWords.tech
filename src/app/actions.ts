'use server';

import { executeD1Query } from '@/lib/db';
import { sendContactNotification, sendWelcomeEmail, sendNewSubscriberAlert } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';
import type { Comment } from '@/types';

/**
 * 1. Subscribe to Newsletter (Cloudflare D1 + Instant Email)
 */
export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email')?.toString().trim().toLowerCase();

    if (!email) {
      return { success: false, message: 'Email is required' };
    }

    // Check if email already exists in newsletter table
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

    // Fire welcome email to subscriber & alert owner asynchronously
    const name = email.split('@')[0];
    Promise.all([
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

/** Backward compatibility alias */
export async function subscribeToNewsletter1(prevState: any, formData: FormData) {
  return subscribeToNewsletter(prevState, formData);
}

/**
 * 2. Submit Contact Form (Cloudflare D1 + Email Notification)
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

    // Send email alert to owner
    sendContactNotification(name, email, message, id).catch((err) =>
      console.error('[Contact Form Notification Error]', err)
    );

    return { success: true, message: 'Contact form submitted successfully', id };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { success: false, message: 'Failed to submit contact form. Please try again.' };
  }
}

/**
 * 3. Add Comment to Cloudflare D1
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
 * 4. Fetch Comments from Cloudflare D1 (Organized as Threaded Tree)
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

    // Organize comments into parent/child threads
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
 * 5. Upvote a Comment
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
 * 6. Downvote a Comment
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
 * 7. Generate Article Summary using Gemini
 */
export async function generateArticleSummaryAction(articleContent: string): Promise<{ summary?: string; error?: string }> {
  if (!articleContent.trim()) {
    return { error: 'Article content cannot be empty.' };
  }

  const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];
  const prompt = `Please provide a concise summary of the following article content. Focus on the main points and key information:

${articleContent}

Summary:`;

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      console.log(`[generateArticleSummaryAction] Trying model: ${modelName}`);
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
      const is503 =
        err.message?.includes('503') ||
        err.message?.includes('Service Unavailable') ||
        err.message?.includes('high demand');
      console.warn(`[generateArticleSummaryAction] Model ${modelName} failed${is503 ? ' (503 – retrying with fallback)' : ''}:`, err.message);
      if (!is503) break;
    }
  }

  console.error('[generateArticleSummaryAction] All models failed:', lastError);
  let errorMessage = 'An error occurred while generating the summary.';
  if (lastError?.message) {
    errorMessage += ` Details: ${lastError.message}`;
  }
  return { error: errorMessage };
}
