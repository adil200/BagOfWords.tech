/**
 * Migration Script: data.ts → Appwrite Database
 * 
 * This script migrates existing articles from data.ts to Appwrite database
 * Run with: node --loader ts-node/esm src/scripts/migrate-articles.ts
 */

import { Client, Databases, ID } from 'node-appwrite';
import { articles } from '../lib/data';
import { FILE_IDS } from '../lib/file-mapping';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '68c2cc43002c27903449';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68a9e75000030fe77800';
const API_KEY = process.env.APPWRITE_API_KEY!;
const ARTICLES_COLLECTION_ID = 'articles';

console.log('Environment check:');
console.log('DATABASE_ID:', DATABASE_ID);
console.log('PROJECT_ID:', PROJECT_ID);
console.log('API_KEY exists:', !!API_KEY);

// Initialize Appwrite client
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

/**
 * Calculate reading time from content
 */
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Extract cover image filename and ID from heroImageUrl
 */
function extractImageInfo(heroImageUrl: string): { filename: string; fileId: string } {
  // Try to extract filename from the getAppwriteImageUrl pattern
  for (const [filename, fileId] of Object.entries(FILE_IDS)) {
    if (heroImageUrl.includes(fileId)) {
      return { filename, fileId };
    }
  }
  return { filename: '', fileId: '' };
}

/**
 * Migrate a single article
 */
async function migrateArticle(article: any, index: number) {
  try {
    console.log(`\n[${index + 1}/${articles.length}] Migrating: ${article.title}`);

    const imageInfo = extractImageInfo(article.heroImageUrl || '');
    const readingTime = article.readingTime || calculateReadingTime(article.content);

    const data = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content,
      category: article.category,
      tags: Array.isArray(article.tags) ? article.tags : [],
      author: article.author?.name || 'Adil Naib',
      coverImage: imageInfo.filename,
      coverImageId: imageInfo.fileId,
      status: 'published',
      featured: false,
      readTime: parseInt(readingTime) || 5,
      views: 0,
      publishedAt: article.publishDate?.toISOString() || new Date().toISOString(),
      // Note: $createdAt is automatically set by Appwrite
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      ID.unique(),
      data
    );

    console.log(`✅ Success: ${article.title} (ID: ${response.$id})`);
    return { success: true, article: article.title };
  } catch (error: any) {
    console.error(`❌ Failed: ${article.title}`);
    console.error(`   Error: ${error.message}`);
    return { success: false, article: article.title, error: error.message };
  }
}

/**
 * Main migration function
 */
async function migrateAll() {
  console.log('🚀 Starting migration from data.ts to Appwrite...\n');
  console.log(`Database ID: ${DATABASE_ID}`);
  console.log(`Collection ID: ${ARTICLES_COLLECTION_ID}`);
  console.log(`Total articles to migrate: ${articles.length}\n`);
  console.log('═'.repeat(60));

  const results = {
    success: [] as string[],
    failed: [] as { article: string; error: string }[],
  };

  for (let i = 0; i < articles.length; i++) {
    const result = await migrateArticle(articles[i], i);
    
    if (result.success) {
      results.success.push(result.article);
    } else {
      results.failed.push({
        article: result.article,
        error: result.error || 'Unknown error',
      });
    }

    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successfully migrated: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed articles:');
    results.failed.forEach(item => {
      console.log(`   - ${item.article}: ${item.error}`);
    });
  }

  console.log('\n🎉 Migration complete!');
}

// Run migration
migrateAll().catch(error => {
  console.error('Fatal error during migration:', error);
  process.exit(1);
});
