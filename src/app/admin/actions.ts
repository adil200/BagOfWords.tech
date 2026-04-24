'use server';

import { serverDatabases } from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const ARTICLES_COLLECTION_ID = 'articles';

/**
 * Generate URL-friendly slug from title
 * Note: This is a utility function, not a server action
 */
function generateSlugUtil(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate slug - async wrapper for client usage
 */
export async function generateSlug(title: string) {
  return generateSlugUtil(title);
}

/**
 * Calculate reading time based on word count (avg 200 words per minute)
 * Note: This is a utility function, not a server action
 */
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Create a new article
 */
export async function createArticle(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string || generateSlugUtil(title);
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const author = formData.get('author') as string || 'Adil Naib';
    const coverImage = formData.get('coverImage') as string;
    const coverImageId = formData.get('coverImageId') as string;
    const status = formData.get('status') as string || 'draft';
    const featured = formData.get('featured') === 'true';

    if (!title || !content || !category) {
      return {
        success: false,
        message: 'Title, content, and category are required',
      };
    }

    const readingTime = calculateReadingTime(content);
    const now = new Date().toISOString();

    const article = await serverDatabases.createDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      ID.unique(),
      {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        category,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        author,
        coverImage: coverImage || '',
        coverImageId: coverImageId || '',
        status,
        featured,
        readTime: parseInt(readingTime) || 5,
        views: 0,
        publishedAt: status === 'published' ? now : null,
      }
    );

    revalidatePath('/admin/articles');
    revalidatePath('/articles');

    return {
      success: true,
      message: 'Article created successfully',
      articleId: article.$id,
    };
  } catch (error: any) {
    console.error('Create article error:', error);
    return {
      success: false,
      message: error.message || 'Failed to create article',
    };
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(articleId: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const author = formData.get('author') as string;
    const coverImage = formData.get('coverImage') as string;
    const coverImageId = formData.get('coverImageId') as string;
    const status = formData.get('status') as string;
    const featured = formData.get('featured') === 'true';

    if (!title || !content || !category) {
      return {
        success: false,
        message: 'Title, content, and category are required',
      };
    }

    const readingTime = calculateReadingTime(content);

    // Get the current article to check if it already has publishedAt
    const currentArticle = await serverDatabases.getDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      articleId
    );

    const updateData: any = {
      title,
      slug,
      excerpt: excerpt || '',
      content,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      author,
      coverImage: coverImage || '',
      coverImageId: coverImageId || '',
      status,
      featured,
      readTime: parseInt(readingTime) || 5,
    };

    // Set publishedAt if changing to published status and not already set
    if (status === 'published' && !currentArticle.publishedAt) {
      updateData.publishedAt = new Date().toISOString();
    }

    await serverDatabases.updateDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      articleId,
      updateData
    );

    revalidatePath('/admin/articles');
    revalidatePath('/articles');
    revalidatePath(`/articles/${slug}`);

    return {
      success: true,
      message: 'Article updated successfully',
    };
  } catch (error: any) {
    console.error('Update article error:', error);
    return {
      success: false,
      message: error.message || 'Failed to update article',
    };
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(articleId: string) {
  try {
    await serverDatabases.deleteDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      articleId
    );

    revalidatePath('/admin/articles');
    revalidatePath('/articles');

    return {
      success: true,
      message: 'Article deleted successfully',
    };
  } catch (error: any) {
    console.error('Delete article error:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete article',
    };
  }
}

/**
 * Get all articles (admin view)
 */
export async function getArticles(filters?: {
  status?: string;
  category?: string;
  search?: string;
}) {
  try {
    const queries: string[] = [Query.orderDesc('publishedAt')];

    if (filters?.status && filters.status !== 'all') {
      queries.push(Query.equal('status', filters.status));
    }

    if (filters?.category && filters.category !== 'all') {
      queries.push(Query.equal('category', filters.category));
    }

    if (filters?.search) {
      queries.push(Query.search('title', filters.search));
    }

    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      queries
    );

    return {
      success: true,
      articles: response.documents,
      total: response.total,
    };
  } catch (error: any) {
    console.error('Get articles error:', error);
    // Return empty result instead of error for better UX
    return {
      success: true,
      message: 'Collection not set up yet. Please create the collection schema first.',
      articles: [],
      total: 0,
    };
  }
}

/**
 * Get a single article by ID
 */
export async function getArticleById(articleId: string) {
  try {
    const article = await serverDatabases.getDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      articleId
    );

    return {
      success: true,
      article,
    };
  } catch (error: any) {
    console.error('Get article error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch article',
    };
  }
}

/**
 * Publish an article (change status from draft to published)
 */
export async function publishArticle(articleId: string) {
  try {
    // Get current article to check if publishedAt exists
    const currentArticle = await serverDatabases.getDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      articleId
    );

    const updateData: any = {
      status: 'published',
    };

    // Set publishedAt if not already set
    if (!currentArticle.publishedAt) {
      updateData.publishedAt = new Date().toISOString();
    }

    await serverDatabases.updateDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      articleId,
      updateData
    );

    revalidatePath('/admin/articles');
    revalidatePath('/articles');

    return {
      success: true,
      message: 'Article published successfully',
    };
  } catch (error: any) {
    console.error('Publish article error:', error);
    return {
      success: false,
      message: error.message || 'Failed to publish article',
    };
  }
}

/**
 * Unpublish an article (change status from published to draft)
 */
export async function unpublishArticle(articleId: string) {
  try {
    await serverDatabases.updateDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      articleId,
      {
        status: 'draft',
      }
    );

    revalidatePath('/admin/articles');
    revalidatePath('/articles');

    return {
      success: true,
      message: 'Article unpublished successfully',
    };
  } catch (error: any) {
    console.error('Unpublish article error:', error);
    return {
      success: false,
      message: error.message || 'Failed to unpublish article',
    };
  }
}

/**
 * Get article statistics for dashboard
 */
export async function getArticleStatsAction() {
  'use server';
  
  try {
    const [allResponse, publishedResponse, draftResponse] = await Promise.all([
      serverDatabases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID, []),
      serverDatabases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID, [
        Query.equal('status', 'published'),
      ]),
      serverDatabases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID, [
        Query.equal('status', 'draft'),
      ]),
    ]);

    const totalViews = allResponse.documents.reduce((sum, doc) => sum + (doc.views || 0), 0);

    return {
      success: true,
      stats: {
        totalArticles: allResponse.total,
        published: publishedResponse.total,
        drafts: draftResponse.total,
        totalViews,
      },
    };
  } catch (error: any) {
    console.error('Failed to fetch stats:', error);
    // Return zero stats instead of error
    return {
      success: false,
      stats: {
        totalArticles: 0,
        published: 0,
        drafts: 0,
        totalViews: 0,
      },
    };
  }
}
