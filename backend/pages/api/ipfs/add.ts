import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { utils } from 'ethers';
import { pinata } from '../../../services/pinata';

const MAX_MESSAGE_SIZE = parseInt(process.env.MAX_MESSAGE_SIZE || '4096');

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type Data = {
  ipfsHash?: string;
  ipfsUrl?: string;
  message: string;
};

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  fn: any
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { address: addressString, sig, metadata } = req?.body || {};

  // basic validation of message
  if (!metadata) {
    return res.status(422).json({ message: 'No message' });
  }
  // validate maximum size to prevent abuse
  const metadataJSONString = JSON.stringify(metadata);
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

  // TODO - verify user signature to the address

  // pin the content to IPFS
  const result = await pinata.pinJSONToIPFS(metadata, {
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: `${address}`,
      // @ts-ignore
      keyvalues: {
        address: address,
      },
    },
  });

  const ipfsHash = String(result.IpfsHash);
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  return res.status(200).json({
    ipfsHash,
    ipfsUrl,
    message: 'success',
  });
}
