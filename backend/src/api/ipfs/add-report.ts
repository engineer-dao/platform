import { Request, Response } from 'express';
import { utils } from 'ethers';
import { pinata } from '../../services/ipfs';

const MAX_MESSAGE_SIZE = parseInt(process.env.MAX_MESSAGE_SIZE || '4096');

type Data = {
  ipfsCid?: string;
  ipfsUrl?: string;
  message?: string;
  detail?: string;
};

export default async function handler(req: Request, res: Response<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { address: addressString, sig, metadata: raw } = req?.body || {};

  if (!raw) {
    return res.status(422).json({ message: 'No message' });
  }
  // validate maximum size to prevent abuse
  const metadataJSONString = JSON.stringify(raw);

  if (metadataJSONString.length > MAX_MESSAGE_SIZE) {
    return res.status(422).json({ message: 'Message too long' });
  }

  if (metadataJSONString.length === 0) {
    return res.status(422).json({ message: 'No message' });
  }

  // validate address
  if (!addressString || !utils.isAddress(addressString)) {
    return res.status(422).json({ message: 'Missing or invalid address' });
  }
  const address = utils.getAddress(addressString);

  // pin the content to IPFS
  const result = await pinata.pinJSONToIPFS(
    { report: raw },
    {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: address,
        // @ts-ignore
        keyvalues: {
          type: 'report',
          address,
        },
      },
    }
  );

  const ipfsCid = String(result.IpfsHash);
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsCid}`;

  return res.status(200).json({
    ipfsCid,
    ipfsUrl,
    message: 'success',
  });
}
