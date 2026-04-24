/**
 * Article Service Layer
 * Handles fetching articles from Appwrite database with fallback to data.ts
 */

import { serverDatabases } from './appwrite-server';
import { Query } from 'node-appwrite';
import { articles as dataArticles, categories as dataCategories } from './data';
import type { Article } from '@/types';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const ARTICLES_COLLECTION_ID = 'articles';

/**
 * Get all published articles from database
 * Falls back to data.ts if database fetch fails
 */
export async function getPublishedArticles(): Promise<any[]> {
  try {
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      [
        Query.equal('status', 'published'),
        Query.orderDesc('publishedAt'),
      ]
    );

    // Convert Appwrite documents to Article type
    return response.documents.map(doc => convertToArticle(doc));
  } catch (error) {
    console.error('Failed to fetch from database, using data.ts fallback:', error);
    return dataArticles;
  }
}

/**
 * Get article by slug
 * Falls back to data.ts if not found in database
 */
export async function getArticleBySlug(slug: string): Promise<any | null> {
  try {
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      [Query.equal('slug', slug)]
    );

    if (response.documents.length > 0) {
      return convertToArticle(response.documents[0]);
    }

    // Fallback to data.ts
    return dataArticles.find(article => article.slug === slug) || null;
  } catch (error) {
    console.error('Failed to fetch article from database, using data.ts fallback:', error);
    return dataArticles.find(article => article.slug === slug) || null;
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      [
        Query.equal('status', 'published'),
        Query.equal('category', category),
        Query.orderDesc('createdAt'),
      ]
    );

    return response.documents.map(doc => convertToArticle(doc));
  } catch (error) {
    console.error('Failed to fetch from database, using data.ts fallback:', error);
    return dataArticles.filter(article => article.category === category);
  }
}

/**
 * Get all article slugs for static generation
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      [Query.equal('status', 'published')]
    );

    const dbSlugs = response.documents.map(doc => doc.slug);
    const dataSlugs = dataArticles.map(article => article.slug);

    // Combine and deduplicate
    return Array.from(new Set([...dbSlugs, ...dataSlugs]));
  } catch (error) {
    console.error('Failed to fetch slugs from database, using data.ts fallback:', error);
    return dataArticles.map(article => article.slug);
  }
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<Article[]> {
  try {
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      [
        Query.equal('status', 'published'),
        Query.search('title', query),
      ]
    );

    return response.documents.map(doc => convertToArticle(doc));
  } catch (error) {
    console.error('Search failed, using data.ts fallback:', error);
    const lowerQuery = query.toLowerCase();
    return dataArticles.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * Convert Appwrite document to Article type
 */
function convertToArticle(doc: any): any {
  const publishedDate = doc.publishedAt || doc.$createdAt || doc.createdAt || new Date().toISOString();
  
  return {
    $id: doc.$id,
    $createdAt: doc.$createdAt,
    publishedAt: doc.publishedAt,
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    author: {
      id: '1',
      name: doc.author || 'Adil Naib',
      avatarUrl: 'https://fra.cloud.appwrite.io/v1/storage/buckets/68c2db3e000567f1099a/files/68c51529003933a7cb34/view?project=68a9e75000030fe77800&mode=admin',
      bio: 'AI & ML enthusiast',
    },
    publishDate: new Date(publishedDate),
    createdAt: publishedDate,
    readingTime: doc.readTime ? `${doc.readTime} min read` : '5 min read',
    readTime: doc.readTime || 5,
    heroImageUrl: doc.coverImage 
      ? `https://fra.cloud.appwrite.io/v1/storage/buckets/68c2db3e000567f1099a/files/${doc.coverImageId}/preview?project=68a9e75000030fe77800`
      : '',
    coverImage: doc.coverImage,
    coverImageId: doc.coverImageId,
    excerpt: doc.excerpt || '',
    content: doc.content,
    status: doc.status,
    featured: doc.featured || false,
    views: doc.views || 0,
  };
}

/**
 * Get article count statistics
 */
export async function getArticleStats() {
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
      totalArticles: allResponse.total,
      published: publishedResponse.total,
      drafts: draftResponse.total,
      totalViews,
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return {
      totalArticles: dataArticles.length,
      published: dataArticles.length,
      drafts: 0,
      totalViews: 0,
    };
  }
}
