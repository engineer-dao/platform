import { BigNumber } from 'ethers';
import { IJobMetaData } from 'interfaces/IJobData';
import { CID, digest } from 'multiformats';
import * as raw from 'multiformats/codecs/raw';
import { Buffer } from 'buffer';
import { sha256 } from 'multiformats/hashes/sha2';

interface IPostMetaData {
  address: string;
  sig: string;
  metadata: IJobMetaData;
}

interface IPostMetaDataResponse {
  ipfsHashDigest: BigNumber;
  ipfsHash: string;
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
  const ipfsHashDigest = cidToDigest(apiResponse.ipfsHash);

  return { ipfsHashDigest, ...apiResponse } as IPostMetaDataResponse;
};

export const fetchIpfsMetaData = async (cidString: string) => {
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cidString}`;
  const response = await fetch(ipfsUrl, {
    method: 'GET',
  });

  const apiResponse = await response.json();
  return apiResponse;
};

export const cidToDigest = (cidString: string) => {
  const cid = CID.parse(cidString);
  if (cid === null) {
    return BigNumber.from(0);
  }

  return BigNumber.from(cid.multihash.digest);
};

export const digestToCid = (cidDigest: BigNumber) => {
  const hex = cidDigest.toHexString().substring(2);
  const uintArray = Uint8Array.from(Buffer.from(hex, 'hex'));
  const multiHashDigest = digest.create(sha256.code, uintArray);
  const cid = CID.create(1, raw.code, multiHashDigest);

  return cid.toString();
};
