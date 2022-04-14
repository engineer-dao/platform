import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error('FIREBASE_SERVICE_ACCOUNT_KEY must be defined');
  process.exit();
}

const serviceAccount = JSON.parse(
  String(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
);

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig, 'default');

// make all database key selectors relative to the deployed smart contract
//   Deploying a new contract will create a fresh database
export const contractDatabaseRef = (selector: string) => {
  const database = getDatabase(app);
  const smartContractId = getSmartContractId();
  return database.ref(`${smartContractId}/${selector}`);
};

// the last 8 characters of the deployed job contract
const getSmartContractId = () => {
  const address = String(process.env.JOB_CONTRACT_ADDRESS);
  return address.substring(address.length - 8).toLowerCase();
};
