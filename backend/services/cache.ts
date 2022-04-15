import { contractDatabaseRef } from './db';
import { getIPFSData } from './ipfs';

export const getIPFSfromCache = async (cid: string) => {
  const ref = contractDatabaseRef(`ipfs/${cid}`);

  const res = (await ref.get()).val();

  if (!res) {
    const metadata = await (await getIPFSData(cid)).json();

    await ref.set({
      metadata,
      created_at: new Date().toISOString(),
    });

    return metadata;
  }

  return res?.metadata;
};
