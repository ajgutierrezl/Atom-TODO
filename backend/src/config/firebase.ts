import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore;

const initializeFirebase = () => {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT is required');
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // Inicializar la aplicación de Firebase
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    // Inicializar Firestore
    db = app.firestore();

    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

const getFirestore = () => {
  if (!db) {
    throw new Error('Firestore has not been initialized. Call initializeFirebase() first.');
  }
  return db;
};

export { admin, getFirestore, initializeFirebase }; 