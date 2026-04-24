/**
 * Fix Article Dates Script
 * Updates article dates to match original publishDate from data.ts
 */

import { Client, Databases } from 'node-appwrite';
import { articles } from '../lib/data';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '68c2cc43002c27903449';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68a9e75000030fe77800';
const API_KEY = process.env.APPWRITE_API_KEY!;
const ARTICLES_COLLECTION_ID = 'articles';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function fixArticleDates() {
  console.log('🔧 Fixing article dates...\n');

  try {
    // Get all articles from database
    const response = await databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID);
    
    console.log(`Found ${response.documents.length} articles in database\n`);

    for (const doc of response.documents) {
      // Find matching article in data.ts by slug
      const originalArticle = articles.find(a => a.slug === doc.slug);
      
      if (originalArticle && originalArticle.publishDate) {
        console.log(`Updating: ${doc.title}`);
        console.log(`  Old date: ${doc.$createdAt}`);
        console.log(`  New date: ${originalArticle.publishDate.toISOString()}`);
        
        // Note: We cannot change $createdAt directly in Appwrite
        // It's a system field, but the correct date is now stored there from creation
        // The articles are showing today's date because they were just created
        
        console.log(`  ℹ️  Article was created today, original date was: ${originalArticle.publishDate.toLocaleDateString()}`);
        console.log('');
      } else {
        console.log(`⚠️  No matching article found for: ${doc.title}\n`);
      }
    }

    console.log('\n📝 Note: Appwrite uses $createdAt as a system field that cannot be changed.');
    console.log('The articles are showing today\'s date because they were just migrated today.');
    console.log('\nTo preserve original dates, we need to:');
    console.log('1. Delete existing articles');
    console.log('2. Re-run migration with a method that sets creation date');
    console.log('\nAlternatively, we can display the original publishDate in the UI instead of $createdAt.');

  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

fixArticleDates();
