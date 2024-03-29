import { initializeApp, getApp, cert, App } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

let app: App | undefined;

// make all database key selectors relative to the deployed smart contract
//   Deploying a new contract will create a fresh database
export const contractDatabaseRef = (selector: string) => {
  try {
    const app = getFirebaseApp();
    const database = getDatabase(app);
    return database.ref(`${getSmartContractId()}/${selector}`);
  } catch (e: any) {
    throw new Error(e);
  }
};

// the last 8 characters of the deployed job contract
const getSmartContractId = () => {
  const address = String(process.env.JOB_CONTRACT_ADDRESS);
  return address.substring(address.length - 8).toLowerCase();
};

const getFirebaseApp = () => {
  // try to load the app from memory
  //  this will throw an error if the app has not been initialized yet
  if (app === undefined) {
    try {
      app = getApp('main');
    } catch (e) {
      app = undefined;
    }
  }

  try {
    if (app === undefined) {
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.error('FIREBASE_SERVICE_ACCOUNT_KEY must be defined');
        process.exit();
      }

      const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.replace(
        /\\n/g,
        '\n'
      );

      const serviceAccount = cert({
        projectId: 'engineerdao',
        privateKey,
        clientEmail:
          'firebase-adminsdk-h7yfg@engineerdao.iam.gserviceaccount.com',
      });

      const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        credential: serviceAccount,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,

        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      };

      app = initializeApp(firebaseConfig, 'main');
    }

    return app;
  } catch (e) {
    throw new Error(`Unable to initialize Firebase app: ${e}`);
  }
};
