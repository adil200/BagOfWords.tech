'use server';

import { serverDatabases } from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';
import type { Comment } from '@/types';
import { Client, Users, MessagingProviderType, Query as AppwriteQuery } from 'node-appwrite';
import { v4 as uuidv4 } from 'uuid';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const CONTACT_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID!;
const NEWSLETTER_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID!;
const COMMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!;

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
    try {
        const email = formData.get('email')?.toString();

        if (!email) {
            return { success: false, message: 'Email is required' };
        }

        // Extract name from email (everything before '@')
        const name = email.split('@')[0];

        // FIRST: Check if email already exists in newsletter collection
        try {
            const existingNewsletterSubscriptions = await serverDatabases.listDocuments(
                DATABASE_ID,
                NEWSLETTER_COLLECTION_ID,
                [Query.equal('email', email)]
            );

            if (existingNewsletterSubscriptions.total > 0) {
                console.log('Email already subscribed to newsletter:', email);
                return {
                    success: true,
                    message: 'You are already subscribed to our newsletter!'
                };
            }
        } catch (error) {
            console.error('Error checking newsletter collection:', error);
            return {
                success: false,
                message: 'Failed to verify subscription. Please try again later.'
            };
        }

        // Initialize Appwrite client and users
        const client = new Client()
            .setEndpoint('https://fra.cloud.appwrite.io/v1')
            .setProject(PROJECT_ID)
            .setKey(APPWRITE_API_KEY);

        const users = new Users(client);

        try {
            // Check if user already exists by listing users with this email
            const existingUsers = await users.list([
                AppwriteQuery.equal('email', email)
            ]);

            if (existingUsers.total === 0) {
                // User doesn't exist, create a new one
                const userId = uuidv4();
                // Generate a secure random password (user can reset it later if needed)
                const randomPassword = `${uuidv4()}-${uuidv4()}`.substring(0, 32);
                
                await users.create(
                    userId,
                    email,
                    undefined, // phone (optional)
                    randomPassword, // password
                    name // name extracted from email
                );

                // Add label to identify newsletter subscribers
                try {
                    await users.updateLabels(userId, ['newsletter_subscriber']);
                    console.log('Newsletter subscriber label added to user:', userId);
                } catch (labelError) {
                    console.error('Error adding newsletter label:', labelError);
                    // Continue even if label fails
                }

                console.log('User created successfully in Appwrite Auth:', userId);

                // Create email target for this NEW user
                try {
                    const targetId = ID.unique();
                    const providerId = process.env.EMAIL_PROVIDER_ID || 'default_email_provider';

                    await users.createTarget(
                        userId,
                        targetId,
                        MessagingProviderType.Email,
                        email,
                        providerId,
                        'BagOfWords Newsletter Subscriber'
                    );
                    console.log('Email target created successfully');
                } catch (targetError: any) {
                    // Log but don't fail if target creation fails
                    if (targetError.code === 409) {
                        console.log('Email target already exists for this user');
                    } else {
                        console.error('Error creating email target:', targetError);
                    }
                }
            } else {
                console.log('User already exists in Appwrite Auth:', existingUsers.users[0].$id);
            }

            // Save to the newsletter collection
            const newsletterFormData = new FormData();
            newsletterFormData.append('email', email);
            await subscribeToNewsletter1({}, newsletterFormData);

            return {
                success: true,
                message: 'Successfully subscribed to our newsletter!'
            };

        } catch (error) {
            console.error('Error creating user or subscribing:', error);
            return {
                success: false,
                message: 'Failed to subscribe. Please try again later.'
            };
        }
    } catch (error) {
        console.error('Subscription error:', error);
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.'
        };
    }
}



export async function submitContactForm(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        if (!name || !email || !message) {
            return { success: false, message: 'All fields are required' };
        }

        // Save contact form to database
        const response = await serverDatabases.createDocument(
            DATABASE_ID,
            CONTACT_COLLECTION_ID,
            ID.unique(),
            {
                name,
                email,
                message,
                status: 'new'
            }
        );

        console.log('Contact form submitted successfully:', response.$id);

        // Create Appwrite user
        const client = new Client()
            .setEndpoint('https://fra.cloud.appwrite.io/v1')
            .setProject(PROJECT_ID)
            .setKey(APPWRITE_API_KEY);

        const users = new Users(client);

        try {
            // Check if user already exists by listing users with this email
            const existingUsers = await users.list([
                AppwriteQuery.equal('email', email)
            ]);

            if (existingUsers.total === 0) {
                // User doesn't exist, create a new one
                const userId = uuidv4();
                // Generate a secure random password (user can reset it later if needed)
                const randomPassword = `${uuidv4()}-${uuidv4()}`.substring(0, 32);
                
                await users.create(
                    userId,
                    email,
                    undefined, // phone (optional)
                    randomPassword, // password
                    name // name
                );

                console.log('User created successfully in Appwrite Auth:', userId);
            } else {
                console.log('User already exists in Appwrite Auth:', existingUsers.users[0].$id);
            }
        } catch (userError) {
            // Log the error but don't fail the contact form submission
            console.error('Error creating user in Appwrite Auth:', userError);
        }

        return { success: true, message: 'Contact form submitted successfully', id: response.$id };
    } catch (error) {
        console.error('Contact form submission error:', error);
        return { success: false, message: 'Failed to submit contact form. Please try again.' };
    }
}

export async function subscribeToNewsletter1(prevState: any, formData: FormData) {
    try {
        const email = formData.get('email') as string;

        if (!email) {
            return { success: false, message: 'Email is required' };
        }

        const response = await serverDatabases.createDocument(
            DATABASE_ID,
            NEWSLETTER_COLLECTION_ID,
            ID.unique(),
            {
                email,
                status: 'active'
            }
        );

        console.log('Newsletter subscription successful:', response.$id);
        return { success: true, message: 'Successfully subscribed to newsletter!' };
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return { success: false, message: 'Failed to subscribe. Please try again.' };
    }
}

export async function addCommentToAppwrite(
    articleSlug: string,
    content: string,
    authorName: string,
    authorAvatar?: string,
    parentId?: string | null,
    isAuthor?: boolean
) {
    try {
        const response = await serverDatabases.createDocument(
            DATABASE_ID,
            COMMENTS_COLLECTION_ID,
            ID.unique(),
            {
                articleSlug,
                content,
                authorName,
                authorAvatar: authorAvatar || '',
                parentId: parentId || null,
                isAuthor: isAuthor || false,
                upvotes: 0,
                downvotes: 0,
                timestamp: new Date().toISOString()
            }
        );

        console.log('Comment added successfully:', response.$id);
        return { success: true, message: 'Comment added successfully' };
    } catch (error) {
        console.error('Add comment error:', error);
        return { success: false, message: 'Failed to add comment. Please try again.' };
    }
}

export async function getCommentsFromAppwrite(articleSlug: string): Promise<Comment[]> {
    try {
        const response = await serverDatabases.listDocuments(
            DATABASE_ID,
            COMMENTS_COLLECTION_ID,
            [
                Query.equal('articleSlug', articleSlug),
                Query.orderDesc('$createdAt')
            ]
        );

        const comments = response.documents.map(doc => ({
            id: doc.$id,
            content: doc.content,
            author: {
                name: doc.authorName,
                avatarUrl: doc.authorAvatar || undefined
            },
            timestamp: doc.timestamp,
            upvotes: doc.upvotes || 0,
            downvotes: doc.downvotes || 0,
            parentId: doc.parentId || null,
            isAuthor: doc.isAuthor || false,
            replies: []
        }));

        // Organize comments into threads
        const commentMap = new Map<string, Comment>();
        const rootComments: Comment[] = [];

        // First pass: create all comments
        comments.forEach(comment => {
            commentMap.set(comment.id, comment);
        });

        // Second pass: organize into parent-child relationships
        comments.forEach(comment => {
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

export async function upvoteComment(commentId: string) {
    try {
        const comment = await serverDatabases.getDocument(
            DATABASE_ID,
            COMMENTS_COLLECTION_ID,
            commentId
        );

        await serverDatabases.updateDocument(
            DATABASE_ID,
            COMMENTS_COLLECTION_ID,
            commentId,
            {
                upvotes: (comment.upvotes || 0) + 1
            }
        );

        return { success: true, message: 'Comment upvoted!' };
    } catch (error) {
        console.error('Upvote error:', error);
        return { success: false, message: 'Failed to upvote comment.' };
    }
}

export async function downvoteComment(commentId: string) {
    try {
        const comment = await serverDatabases.getDocument(
            DATABASE_ID,
            COMMENTS_COLLECTION_ID,
            commentId
        );

        await serverDatabases.updateDocument(
            DATABASE_ID,
            COMMENTS_COLLECTION_ID,
            commentId,
            {
                downvotes: (comment.downvotes || 0) + 1
            }
        );

        return { success: true, message: 'Comment downvoted!' };
    } catch (error) {
        console.error('Downvote error:', error);
        return { success: false, message: 'Failed to downvote comment.' };
    }
}

export async function generateArticleSummaryAction(articleContent: string): Promise<{ summary?: string; error?: string }> {
    if (!articleContent.trim()) {
        return { error: "Article content cannot be empty." };
    }

    try {
        console.log('[generateArticleSummaryAction] Starting summary generation...');

        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `Please provide a concise summary of the following article content. Focus on the main points and key information:

${articleContent}

Summary:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        if (summary && summary.trim()) {
            console.log('[generateArticleSummaryAction] Summary generated successfully, length:', summary.length);
            return { summary: summary.trim() };
        } else {
            console.error('[generateArticleSummaryAction] Empty summary returned');
            return { error: "Failed to generate summary. Empty response." };
        }
    } catch (err: any) {
        console.error('[generateArticleSummaryAction] Error:', err);
        let errorMessage = 'An error occurred while generating the summary.';
        if (err.message) {
            errorMessage += ` Details: ${err.message}`;
        }
        return { error: errorMessage };
    }
}
