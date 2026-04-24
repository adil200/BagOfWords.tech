/**
 * Setup Script: Create Articles Collection in Appwrite
 * 
 * This script creates the 'articles' collection with the correct schema
 * Run this BEFORE using the admin portal or migrating articles
 * 
 * Usage: npx ts-node --compiler-options '{"module":"commonjs"}' src/scripts/setup-collection.ts
 */

import { Client, Databases, Permission, Role, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = 'articles';

async function setupCollection() {
  console.log('🚀 Starting Appwrite Articles Collection Setup...\n');

  try {
    // Step 1: Check if collection already exists
    console.log('📋 Checking if collection exists...');
    try {
      await databases.getCollection(DATABASE_ID, COLLECTION_ID);
      console.log('✅ Collection already exists!');
      console.log('\nℹ️  If you need to recreate it, delete it from Appwrite Console first.');
      return;
    } catch (error: any) {
      if (error.code === 404) {
        console.log('Collection not found, creating new one...\n');
      } else {
        throw error;
      }
    }

    // Step 2: Create collection
    console.log('📦 Creating articles collection...');
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Articles',
      [
        Permission.read(Role.any()),
        Permission.create(Role.label('Admin')),
        Permission.read(Role.label('Admin')),
        Permission.update(Role.label('Admin')),
        Permission.delete(Role.label('Admin')),
      ],
      false, // documentSecurity
      true   // enabled
    );
    console.log('✅ Collection created!\n');

    // Step 3: Create attributes
    console.log('🔧 Creating attributes...');

    const attributes = [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'excerpt', type: 'string', size: 1000, required: false },
      { key: 'content', type: 'string', size: 1000000, required: true }, // 1MB for rich content
      { key: 'category', type: 'string', size: 100, required: true },
      { key: 'tags', type: 'string', size: 500, required: false, array: true },
      { key: 'author', type: 'string', size: 100, required: true },
      { key: 'coverImage', type: 'string', size: 255, required: false },
      { key: 'coverImageId', type: 'string', size: 100, required: false },
      { key: 'status', type: 'string', size: 50, required: true, default: 'draft' },
      { key: 'featured', type: 'boolean', required: false, default: false },
      { key: 'readingTime', type: 'integer', required: false, default: 5 },
      { key: 'views', type: 'integer', required: false, default: 0 },
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            attr.key,
            attr.size!,
            attr.required,
            attr.default as string | undefined,
            attr.array || false
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            attr.key,
            attr.required,
            attr.default as boolean | undefined,
            attr.array || false
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            attr.key,
            attr.required,
            undefined, // min
            undefined, // max
            attr.default as number | undefined,
            attr.array || false
          );
        }
        console.log(`  ✓ Created attribute: ${attr.key}`);
        
        // Wait a bit between attribute creations
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`  ✗ Failed to create attribute ${attr.key}:`, error.message);
      }
    }

    console.log('\n✅ All attributes created!\n');

    // Step 4: Create indexes
    console.log('🔍 Creating indexes...');
    
    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        'slug_index',
        'unique' as any,
        ['slug'],
        ['asc'] as any
      );
      console.log('  ✓ Created unique index on slug');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error: any) {
      console.error('  ✗ Failed to create slug index:', error.message);
    }

    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        'status_index',
        'key' as any,
        ['status'],
        ['asc'] as any
      );
      console.log('  ✓ Created index on status');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error: any) {
      console.error('  ✗ Failed to create status index:', error.message);
    }

    try {
      await databases.createIndex(
        DATABASE_ID,
        COLLECTION_ID,
        'category_index',
        'key' as any,
        ['category'],
        ['asc'] as any
      );
      console.log('  ✓ Created index on category');
    } catch (error: any) {
      console.error('  ✗ Failed to create category index:', error.message);
    }

    console.log('\n🎉 Collection setup complete!\n');
    console.log('Next steps:');
    console.log('1. Wait 2-3 minutes for indexes to finish building');
    console.log('2. Run migration script: npx ts-node --compiler-options \'{"module":"commonjs"}\' src/scripts/migrate-articles.ts');
    console.log('3. Access admin portal: Press Ctrl+Shift+A and log in\n');

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupCollection();
