import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { getSmartContractId } from 'utils/contract';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);

// make all database key selectors relative to the deployed smart contract
//   Deploying a new contract will create a fresh database
export const contractDatabaseRef = (selector: string) => {
  return ref(database, `${getSmartContractId()}/${selector}`);
};
