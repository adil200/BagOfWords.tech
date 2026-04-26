/**
 * Article Service Layer
 * Handles fetching articles from local MDX files
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article } from '@/types';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');

// Helper to read and parse an MDX file
function getArticleData(fileName: string): any {
  const fullPath = path.join(articlesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Provide defaults for missing metadata
  const publishDate = data.publishDate || new Date().toISOString();
  
  return {
    $id: data.slug || fileName.replace(/\.mdx$/, ''),
    $createdAt: publishDate,
    publishedAt: publishDate,
    slug: data.slug || fileName.replace(/\.mdx$/, ''),
    title: data.title || 'Untitled',
    category: data.category || 'Uncategorized',
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: {
      id: '1',
      name: data.author || 'Adil Naib',
      avatarUrl: 'https://fra.cloud.appwrite.io/v1/storage/buckets/68c2db3e000567f1099a/files/68c51529003933a7cb34/view?project=68a9e75000030fe77800&mode=admin',
      bio: 'AI & ML enthusiast',
    },
    publishDate: new Date(publishDate),
    createdAt: publishDate,
    readingTime: data.readingTime || '5 min read',
    readTime: parseInt(data.readingTime) || 5,
    heroImageUrl: data.heroImageUrl || '',
    excerpt: data.excerpt || '',
    content: content,
    status: 'published',
    featured: data.featured || false,
    views: data.views || 0,
  };
}

/**
 * Get all published articles from local MDX files
 */
export async function getPublishedArticles(): Promise<any[]> {
  try {
    if (!fs.existsSync(articlesDirectory)) return [];
    
    const fileNames = fs.readdirSync(articlesDirectory);
    const articles = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => getArticleData(fileName));

    // Sort articles by date descending
    return articles.sort((a, b) => {
      if (a.publishDate < b.publishDate) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Failed to get articles from local MDX:', error);
    return [];
  }
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<any | null> {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
    
    if (fs.existsSync(fullPath)) {
      return getArticleData(`${slug}.mdx`);
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to get article by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter(article => article.category === category);
}

/**
 * Get all article slugs for static generation
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(articlesDirectory)) return [];
    
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(fileName => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Failed to get article slugs:', error);
    return [];
  }
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getPublishedArticles();
  const lowerQuery = query.toLowerCase();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.excerpt.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get article count statistics
 */
export async function getArticleStats() {
  const articles = await getPublishedArticles();
  const totalViews = articles.reduce((sum, doc) => sum + (doc.views || 0), 0);

  return {
    totalArticles: articles.length,
    published: articles.length,
    drafts: 0,
    totalViews,
  };
}
