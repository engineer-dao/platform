import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { utils } from 'ethers';
import { pinata } from '../../../services/ipfs';
import { transformJobToIPFS } from '../../../services/schema/transform';
import { validate } from '../../../services/schema/validate';
import { middleware } from '../../../middleware/middleware';

const MAX_MESSAGE_SIZE = parseInt(process.env.MAX_MESSAGE_SIZE || '4096');

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type Data = {
  ipfsCid?: string;
  ipfsUrl?: string;
  message?: string;
  detail?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await middleware(req, res, cors);

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

  // Transform to IPFS format to validate
  const transformedRaw = transformJobToIPFS(raw);

  const { isValid, error } = validate(transformedRaw);

  if (!isValid) {
    return res.status(400).json({
      message: 'Invalid form data',
      detail: error,
    });
  }

  // pin the content to IPFS
  const result = await pinata.pinJSONToIPFS(transformedRaw, {
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: address,
      // @ts-ignore
      keyvalues: {
        type: 'job',
        address: address,
      },
    },
  });

  const ipfsCid = String(result.IpfsHash);
  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsCid}`;

  return res.status(200).json({
    ipfsCid,
    ipfsUrl,
    message: 'success',
  });
}
