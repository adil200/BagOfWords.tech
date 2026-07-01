import { Client, Databases } from 'node-appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'default_project')
    .setKey(process.env.APPWRITE_API_KEY || 'default_key');

export const serverDatabases = new Databases(client);
