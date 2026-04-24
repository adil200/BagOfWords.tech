'use server';

import { Client, Storage, ID, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const storage = new Storage(client);

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!;

/**
 * Upload an image file to Appwrite storage
 */
export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        message: 'No file provided',
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        message: 'File must be an image',
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size must be less than 5MB',
      };
    }

    // Convert File to Buffer for node-appwrite
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create InputFile from buffer
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    // Upload to Appwrite
    const response = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      inputFile
    );

    return {
      success: true,
      message: 'Image uploaded successfully',
      fileId: response.$id,
      filename: file.name,
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: error.message || 'Failed to upload image',
    };
  }
}

/**
 * Delete an image file from Appwrite storage
 */
export async function deleteImage(fileId: string) {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);

    return {
      success: true,
      message: 'Image deleted successfully',
    };
  } catch (error: any) {
    console.error('Delete error:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete image',
    };
  }
}

/**
 * Get all files from the storage bucket
 */
export async function getAllImages() {
  try {
    console.log('Fetching images from bucket:', BUCKET_ID);
    console.log('Using endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
    console.log('Using project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    console.log('API Key available:', !!process.env.APPWRITE_API_KEY);
    
    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
      throw new Error('NEXT_PUBLIC_APPWRITE_ENDPOINT is not configured');
    }
    
    if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not configured');
    }
    
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('APPWRITE_API_KEY is not configured');
    }
    
    if (!BUCKET_ID) {
      throw new Error('NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID is not configured');
    }
    
    // Fetch with higher limit to get all files
    const response = await storage.listFiles(
      BUCKET_ID,
      [Query.limit(100), Query.orderDesc('$createdAt')] // Get up to 100 files, newest first
    );

    console.log('Fetched files count:', response.files.length);
    console.log('Total files in bucket:', response.total);

    const images = response.files.map((file) => ({
      fileId: file.$id,
      filename: file.name,
      size: file.sizeOriginal,
      mimeType: file.mimeType,
      createdAt: file.$createdAt,
      url: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin&width=400&height=300&output=webp`,
    }));

    return {
      success: true,
      images,
      total: response.total,
    };
  } catch (error: any) {
    console.error('Fetch images error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      response: error.response,
    });
    return {
      success: false,
      message: error.message || 'Failed to fetch images',
      images: [],
      total: 0,
    };
  }
}
