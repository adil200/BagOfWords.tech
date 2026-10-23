/**
 * Article Service Layer
 * Handles fetching articles dynamically from local MDX files
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article } from '@/types';


import { getR2AssetUrl } from '@/lib/file-mapping';

// Helper to read and parse an MDX file
function getArticleData(fileName: string): any {
  const fullPath = path.join(process.cwd(), 'src/content/articles', fileName);
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
      avatarUrl: getR2AssetUrl('adil (1).png'),
      bio: 'AI & ML enthusiast',
    },
    publishDate: publishDate,
    createdAt: publishDate,
    readingTime: data.readingTime || '5 min read',
    readTime: parseInt(data.readingTime) || 5,
    heroImageUrl: data.heroImageUrl || '',
    excerpt: data.excerpt || '',
    content: content,
    status: 'published' as const,
    featured: data.featured || false,
    views: data.views || 0,
  };
}

/**
 * Get all published articles from local MDX files
 */
export async function getPublishedArticles(): Promise<any[]> {
  try {
    const fileNames = fs.readdirSync(path.join(process.cwd(), 'src/content/articles'));
    const articles = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => getArticleData(fileName));
      
    // Sort by publishDate descending (newest first)
    return articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Failed to get articles from directory:', error);
    try {
      const fallbackModule = await import('./articles-index.json');
      return fallbackModule.default || fallbackModule;
    } catch (e) {
      const { articles: staticArticles } = await import('./data');
      return staticArticles;
    }
  }
}

export async function getArticleBySlug(slug: string): Promise<any | null> {
  try {
    return getArticleData(`${slug}.mdx`);
  } catch (error) {
    console.error(`Failed to get article by slug ${slug}:`, error);
    try {
      const fallbackModule = await import('./articles-index.json');
      const fallbackArticles = fallbackModule.default || fallbackModule;
      return (fallbackArticles as any[]).find((a) => a.slug === slug) || null;
    } catch (e) {
      const { articles: staticArticles } = await import('./data');
      return staticArticles.find((a: Article) => a.slug === slug) || null;
    }
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
    const fileNames = fs.readdirSync(path.join(process.cwd(), 'src/content/articles'));
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.error('Failed to get article slugs:', error);
    try {
      const fallbackModule = await import('./articles-index.json');
      const fallbackArticles = fallbackModule.default || fallbackModule;
      return (fallbackArticles as any[]).map((a) => a.slug);
    } catch (e) {
      const { articles: staticArticles } = await import('./data');
      return staticArticles.map((a: Article) => a.slug);
    }
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
