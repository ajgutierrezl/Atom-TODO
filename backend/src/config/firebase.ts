import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore;

const initializeFirebase = () => {
  try {
    // Si ya está inicializado, retornar
    if (admin.apps.length) {
      console.log('Firebase ya está inicializado');
      return true;
    }

    if (!process.env.ATOM_FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('ATOM_FIREBASE_SERVICE_ACCOUNT is required');
    }

    console.log('Iniciando configuración de Firebase...');
    const serviceAccount = JSON.parse(process.env.ATOM_FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
    console.log('Firebase inicializado exitosamente');
    return true;
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    throw error;
  }
};

const getFirestore = () => {
  if (!db) {
    throw new Error('Firestore no ha sido inicializado. Llama a initializeFirebase() primero.');
  }
  return db;
};

export { admin, getFirestore, initializeFirebase }; 