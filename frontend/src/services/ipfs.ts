import { IJobMetaData } from 'interfaces/IJobData';

interface IPostMetaData {
  address: string;
  sig: string;
  metadata: IJobMetaData;
}

interface IPostMetaDataResponse {
  ipfsCid: string;
  ipfsUrl: string;
  message: string;
}

export const pinIpfsMetaData = async ({
  address,
  sig,
  metadata,
}: IPostMetaData) => {
  const response = await fetch(`${process.env.REACT_APP_API}/api/ipfs/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      sig,
      metadata,
    }),
  });

  const apiResponse = await response.json();
  return apiResponse as IPostMetaDataResponse;
};

export const fetchIpfsMetaData = async (cidString: string) => {
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cidString}`;
  const response = await fetch(ipfsUrl, {
    method: 'GET',
  });

  const apiResponse = await response.json();
  return apiResponse;
};
