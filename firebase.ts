// Import the functions you need from the SDKs you need
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { FirebaseOptions } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
function getEnv(key: string): string | undefined {
  const extra =
    (Constants.expoConfig &&
      (Constants.expoConfig.extra as Record<string, unknown>)) ||
    {};
  const v = (extra[key] as string | undefined) ?? process.env[key];
  return v;
}

function requireEnv(key: string): string {
  const v = getEnv(key);
  if (!v) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return v;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv("FIREBASE_API_KEY"),
  authDomain: requireEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: requireEnv("FIREBASE_PROJECT_ID"),
  storageBucket: requireEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: requireEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: requireEnv("FIREBASE_APP_ID"),
  measurementId: getEnv("FIREBASE_MEASUREMENT_ID"),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
