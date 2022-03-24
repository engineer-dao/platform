import { ICreateContractForm } from '../components/create-contract/form/ICreateContractForm';

interface IPostMetaData<T> {
  address: string;
  sig: string;
  metadata: T;
}

interface IPostMetaDataResponse {
  ipfsCid: string;
  ipfsUrl: string;
  message: string;
}

const postToIPFS = async (path: string, body: Record<string, any>) => {
  const response = await fetch(`${process.env.REACT_APP_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const apiResponse = await response.json();
  return apiResponse as IPostMetaDataResponse;
};

export const pinIpfsJobMetaData = async ({
  address,
  sig,
  metadata,
}: IPostMetaData<ICreateContractForm>) =>
  postToIPFS('/api/ipfs/add-job', {
    address,
    sig,
    metadata,
  });

export const pinIpfsReportMetaData = async ({
  address,
  sig,
  metadata,
}: IPostMetaData<string>) =>
  postToIPFS('/api/ipfs/add-report', {
    address,
    sig,
    metadata,
  });

export const fetchIpfsMetaData = async (cid: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_API}/api/ipfs/get?cid=${cid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return (await response.json()).data;
};
