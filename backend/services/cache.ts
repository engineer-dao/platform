import { get, push, set } from 'firebase/database';
import { contractDatabaseRef } from './db';
import { getIPFSData } from './ipfs';

export const getIPFSfromCache = async (cid: string) => {
  const ref = contractDatabaseRef(`ipfs/${cid}`);

  const res = (await get(ref)).val();

  if (!res) {
    const metadata = await (await getIPFSData(cid)).json();

    await set(ref, {
      metadata,
      created_at: new Date().toISOString(),
    });

    return metadata;
  }

  return res?.metadata;
};
