import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Para desarrollo, puedes usar credenciales de cuenta de servicio
// Para producción, deberías usar variables de entorno o secretos seguros
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : {
      // Aquí deberías proporcionar una cuenta de servicio real para desarrollo
      // o seguir las instrucciones para configurar Firebase con Google Cloud Functions
      type: 'service_account',
      project_id: 'tu-proyecto-id',
      private_key_id: 'tu-private-key-id',
      private_key: 'tu-private-key',
      client_email: 'tu-client-email',
      client_id: 'tu-client-id',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'tu-client-cert-url',
    };

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// Obtener Firestore
const db = admin.firestore();

export { admin, db }; 