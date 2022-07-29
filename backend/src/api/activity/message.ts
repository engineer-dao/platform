import { utils } from 'ethers';
import { contractDatabaseRef } from '../../services/db';
import {
  addressesMatch,
  addressIsValidForJobId,
} from '../../util/verification';
import { Request, Response } from 'express';

type Data = {
  message: string;
};

export default async function handler(req: Request, res: Response) {
  const { sig, address, message, contract_id: jobId } = req?.body || {};

  // verify that the signatiure is valid
  const verifiedAddress = utils.verifyMessage(message, sig);
  const addressSignatureIsValid = addressesMatch(address, verifiedAddress);

  if (
    addressSignatureIsValid &&
    (await addressIsValidForJobId(verifiedAddress, jobId))
  ) {
    const reference = contractDatabaseRef(`${jobId}/messages`);

    if (!reference) {
      throw new Error('Error fetching message from Firebase');
    }

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
