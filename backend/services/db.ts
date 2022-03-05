import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(
  String(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
);

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'engineerdao.firebaseapp.com',
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://engineerdao-default-rtdb.firebaseio.com',
  projectId: 'engineerdao',
  storageBucket: 'engineerdao.appspot.com',
  messagingSenderId: '367249583128',
  appId: '1:367249583128:web:1c6e777bd5f0f38adce76d',
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export { database };
