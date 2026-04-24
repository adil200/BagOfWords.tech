import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper function with error handling and fallback
export function getFilePreview(fileId: string, width?: number, height?: number, quality?: number) {
    try {
        if (!fileId || !process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID) {
            return '';
        }

        return storage.getFilePreview(
            process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
            fileId,
            width,
            height,
            undefined, // gravity
            quality || 80,
            undefined, // borderWidth
            undefined, // borderColor
            undefined, // borderRadius
            undefined, // opacity
            undefined, // rotation
            undefined, // background
            'webp' // output format
        ).toString();
    } catch (error) {
        console.warn('Failed to generate preview URL:', error);
        return '';
    }
}

// Helper function for file view with error handling
export function getFileView(fileId: string) {
    try {
        if (!fileId || !process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID) {
            return '';
        }

        return storage.getFileView(
            process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
            fileId
        ).toString();
    } catch (error) {
        console.warn('Failed to generate file URL:', error);
        return '';
    }
}
