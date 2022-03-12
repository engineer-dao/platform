import { ICreateContractForm } from '../components/create-contract/form/ICreateContractForm';

interface IPostMetaData {
  address: string;
  sig: string;
  metadata: ICreateContractForm;
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
