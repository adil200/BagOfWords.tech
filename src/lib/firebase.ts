
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingConfigKeys = Object.entries(firebaseConfigValues)
  .filter(([key, value]) => typeof value === 'undefined')
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`); // Convert camelCase to SNAKE_CASE for the error message

if (missingConfigKeys.length > 0) {
  // Construct a more user-friendly list of env var names as they'd appear in .env.local
  const expectedEnvVars = Object.keys(firebaseConfigValues).map(key => 
    `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`
  );
  const missingEnvVarsActual = expectedEnvVars.filter(envVar => 
    typeof process.env[envVar] === 'undefined'
  );

  throw new Error(
    `Firebase configuration is missing or has undefined values for the following environment variables: ${missingEnvVarsActual.join(', ')}. ` +
    `Please ensure these are correctly set in your .env.local file and that you have restarted the development server.`
  );
}

const firebaseConfig: FirebaseOptions = firebaseConfigValues as FirebaseOptions;

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { app, db };
