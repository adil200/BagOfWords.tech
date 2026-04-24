/**
 * Delete All Articles Script
 * Use this to clean up before re-migration
 */

import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const DATABASE_ID = '68c2cc43002c27903449';
const PROJECT_ID = '68a9e75000030fe77800';
const API_KEY = process.env.APPWRITE_API_KEY!;
const ARTICLES_COLLECTION_ID = 'articles';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function deleteAllArticles() {
  console.log('🗑️  Deleting all articles...\n');

  try {
    const response = await databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID);
    
    console.log(`Found ${response.documents.length} articles to delete\n`);

    for (const doc of response.documents) {
      console.log(`Deleting: ${doc.title}`);
      await databases.deleteDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, doc.$id);
      console.log(`  ✅ Deleted\n`);
      
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('✅ All articles deleted successfully!');
    console.log('\nYou can now run the migration script again to re-import with correct dates.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

deleteAllArticles();
