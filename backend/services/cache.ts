import { IIPFSJobMetaData } from '../interfaces/IJobData';
import { contractDatabaseRef } from './db';
import { getIPFSData } from './ipfs';
import { transformIPFStoJob } from './schema/transform';

export const getIPFSfromCache = async (cid: string) => {
  const ref = contractDatabaseRef(`ipfs/${cid}`);

  const res = (await ref.get()).val();

  if (!res) {
    const _metadata = await (await getIPFSData(cid)).json();

    const metadata = transformIPFStoJob(_metadata as IIPFSJobMetaData);

    await ref.set({
      metadata,
      created_at: new Date().toISOString(),
    });

    return metadata;
  }

  return res?.metadata;
};
