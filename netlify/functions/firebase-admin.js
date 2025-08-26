const admin = require('firebase-admin');

// IMPORTANT: Decode the base64 private key
// Netlify build might mangle the private key if pasted directly.
// A safer approach is to encode it to Base64 and decode here.
// You can use an online tool to Base64 encode your private key value.
// Then, create a FIREBASE_PRIVATE_KEY_BASE64 environment variable in Netlify.
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');


try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

module.exports.db = admin.firestore();
