import { contractDatabaseRef } from 'services/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { utils } from 'ethers';
import { addressesMatch, addressIsValidForJobId } from 'util/verification';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type Data = {
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

  const { sig, address, message, contract_id: jobId } = req?.body || {};

  // verify that the signatiure is valid
  const verifiedAddress = utils.verifyMessage(message, sig);
  const addressSignatureIsValid = addressesMatch(address, verifiedAddress);

  if (
    addressSignatureIsValid &&
    (await addressIsValidForJobId(verifiedAddress, jobId))
  ) {
    const reference = contractDatabaseRef(`${jobId}/messages`);
    const postRef = reference.push();

    await postRef.set({
      address,
      message,
      created_at: new Date().toISOString(),
    });
    res.status(200).json({ message: 'Success' });
  } else {
    res.status(403).json({ message: 'Invalid address for message' });
  }
}
