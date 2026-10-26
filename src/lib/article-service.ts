import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getR2AssetUrl } from '@/lib/file-mapping';
import type { Article } from '@/types';

function getArticleData(fileName: string): Article {
  const fullPath = path.join(process.cwd(), 'src/content/articles', fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

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
    publishDate,
    createdAt: publishDate,
    readingTime: data.readingTime || '5 min read',
    readTime: parseInt(data.readingTime) || 5,
    heroImageUrl: data.heroImageUrl || '',
    excerpt: data.excerpt || '',
    content,
    status: 'published' as const,
    featured: data.featured || false,
    views: data.views || 0,
  };
}

/**
 * Retrieves all published articles from local MDX files, falling back to build-time JSON index.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const fileNames = fs.readdirSync(path.join(process.cwd(), 'src/content/articles'));
    const articles = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => getArticleData(fileName));

    return articles.sort((a, b) => new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime());
  } catch (error) {
    console.error('Failed to get articles from directory:', error);
    try {
      const fallbackModule = await import('./articles-index.json');
      return (fallbackModule.default || fallbackModule) as unknown as Article[];
    } catch {
      const { articles: staticArticles } = await import('./data');
      return staticArticles;
    }
  }
}

/**
 * Retrieves a single article by its slug from MDX files or fallback index.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    return getArticleData(`${slug}.mdx`);
  } catch (error) {
    console.error(`Failed to get article by slug ${slug}:`, error);
    try {
      const fallbackModule = await import('./articles-index.json');
      const fallbackArticles = (fallbackModule.default || fallbackModule) as unknown as Article[];
      return fallbackArticles.find((a) => a.slug === slug) || null;
    } catch {
      const { articles: staticArticles } = await import('./data');
      return staticArticles.find((a: Article) => a.slug === slug) || null;
    }
  }
}

/**
 * Filters published articles by category slug.
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.category === category);
}

/**
 * Collects all article slugs for static generation routes.
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
      const fallbackArticles = (fallbackModule.default || fallbackModule) as unknown as Article[];
      return fallbackArticles.map((a) => a.slug);
    } catch {
      const { articles: staticArticles } = await import('./data');
      return staticArticles.map((a: Article) => a.slug);
    }
  }
}

/**
 * Searches published articles by query matching against title or excerpt.
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getPublishedArticles();
  const lowerQuery = query.toLowerCase();

  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Calculates aggregated article and view statistics.
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
