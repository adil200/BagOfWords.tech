/**
 * Verify publishedAt dates are correctly set
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

async function verifyDates() {
  try {
    console.log('📅 Checking article dates...\n');
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      [Query.orderDesc('publishedAt')]
    );

    console.log(`Found ${response.documents.length} articles:\n`);

    for (const doc of response.documents) {
      const publishedAt = new Date(doc.publishedAt);
      const createdAt = new Date(doc.$createdAt);
      
      console.log(`📝 ${doc.title}`);
      console.log(`   publishedAt: ${publishedAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`);
      console.log(`   $createdAt:  ${createdAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`);
      console.log(`   Category: ${doc.category}`);
      console.log('');
    }

    console.log('✅ Verification complete!');

  } catch (error) {
    console.error('❌ Error verifying dates:', error);
    process.exit(1);
  }
}

verifyDates();
