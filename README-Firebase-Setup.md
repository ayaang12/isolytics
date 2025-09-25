# Firebase Setup for this project

This short guide shows where to get the Firebase Web SDK config values and how to paste them into `app/firebaseConfig.ts` in this repo.

1. Create a Firebase project (if you don't have one)

   - Open the Firebase console: https://console.firebase.google.com
   - Click "Add project" and follow the steps.

2. Register a Web app and get the config
   - In the Firebase console select your project.
   - Click the gear icon (Project settings) -> "Your apps".
   - Click the </> (Web) icon to register a new web app.
   - Give it a nickname (optional) and register the app.
   - After registering you'll be shown the Firebase SDK snippet. Choose the "Config" option (a plain object) — it looks like:

```js
// Example from Firebase console
const firebaseConfig = {
  apiKey: "...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "...",
  appId: "...",
};
```

3. Paste the values into `app/firebaseConfig.ts`

   - Open `app/firebaseConfig.ts` in this repo and replace the placeholder values with the values from the Firebase console.
   - Map fields directly: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

4. Optional: Enable Authentication and Firestore

   - Authentication: Console -> Build -> Authentication -> Get started. Enable sign-in methods you need (Email/Password, Google, etc.).
     - For OAuth providers (Google, Facebook) you'll need to configure OAuth redirect URIs for web apps. For local development with Expo web or localhost, use `http://localhost:19006` (Expo web) or `http://localhost:3000` for standard React web.
   - Firestore: Console -> Build -> Firestore Database -> Create database. Choose Start in test mode for development, then set appropriate security rules before production.

5. Notes for Expo / React Native projects

   - This repo appears to be an Expo project. The Firebase _web_ config object is not secret and can be used in client apps. For many features (Auth, Firestore) the Firebase Web SDK (modular) works fine in Expo-managed apps.
   - If you need native-only Firebase features (Cloud Messaging, some analytics), consider using `react-native-firebase` or a custom dev client.

6. Security and environment

   - The Firebase config is not a secret like an API key for a private service — it identifies your project and is safe to include in client code. Still, don't store server credentials (service account keys) in client-side code.
   - For extra safety you can store config in environment variables and inject at build time.

7. After pasting: verify types
   - Run a quick typecheck in this project to verify TypeScript matches. From the project root:

```bash
npx tsc --noEmit
```

8. Troubleshooting
   - If the console shows an empty/older config, try reloading the Project Settings page or re-register the web app.
   - If Auth redirects fail, ensure the authorized domains include your development origin in Firebase console -> Authentication -> Settings -> Authorized domains.

If you'd like, I can paste an example `firebaseConfig` object into `app/firebaseConfig.ts` using your real values (you'd paste them here), or I can run the typecheck and help wire up a simple sign-in screen.
