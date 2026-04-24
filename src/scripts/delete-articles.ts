/**
 * Delete all articles from Appwrite database
 * Run before re-migration to fix publishedAt dates
 */

import { Databases, Client, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const ARTICLES_COLLECTION_ID = 'articles';

async function deleteAllArticles() {
  try {
    console.log('🗑️  Fetching all articles...');
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID
    );

    console.log(`📊 Found ${response.documents.length} articles to delete`);

    for (const doc of response.documents) {
      console.log(`Deleting: ${doc.title} (ID: ${doc.$id})`);
      await databases.deleteDocument(
        DATABASE_ID,
        ARTICLES_COLLECTION_ID,
        doc.$id
      );
      console.log(`✅ Deleted: ${doc.title}`);
    }

    console.log(`\n✨ Successfully deleted ${response.documents.length} articles`);
    console.log('📌 Now run the migration script to re-import with correct dates:');
    console.log('   npx ts-node --compiler-options \'{"module":"commonjs"}\' src/scripts/migrate-articles.ts');

  } catch (error) {
    console.error('❌ Error deleting articles:', error);
    process.exit(1);
  }
}

deleteAllArticles();
