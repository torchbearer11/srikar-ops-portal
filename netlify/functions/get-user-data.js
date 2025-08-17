const admin = require('firebase-admin');

// This setup uses a single, secure environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

exports.handler = async (event, context) => {
  const { authorization } = event.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return { statusCode: 403, body: 'Forbidden: User role not found' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ role: userDoc.data().role }),
    };
  } catch (error) {
    console.error('Error verifying token or getting role:', error);
    return { statusCode: 401, body: 'Unauthorized' };
  }
};
