import { Request, Response } from 'express';
import { getIPFSData, pinata } from '../../services/ipfs';
import { validate } from '../../services/schema/validate';
import { transformIPFStoJob } from '../../services/schema/transform';
import { IIPFSJobMetaData } from '../../interfaces/IJobData';

interface Data {
  data?: Record<string, any>;
  message?: string;
  detail?: string;
}

export default async function handler(req: Request, res: Response<Data>) {
  const { cid } = req?.query || {};

  const _cid = Array.isArray(cid) ? cid[0] : cid;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!cid) {
    return res.status(422).json({ message: 'Missing CID' });
  }

  const response = await getIPFSData(String(_cid));

  if (response.status !== 200) {
    return res
      .status(500)
      .json({ message: `IPFS error`, detail: String(response?.body) });
  }

  let raw: IIPFSJobMetaData;

  try {
    raw = (await response.json()) as IIPFSJobMetaData;
  } catch (e) {
    return res.status(500).json({ message: `IPFS error`, detail: String(e) });
  }

  const validationResult = validate(raw);

  if (!validationResult.isValid) {
    return res.status(500).json({
      message: `IPFS metadata failed validation`,
      detail: validationResult.error,
    });
  }

  const data = transformIPFStoJob(raw);

  return res.status(200).json({
    data,
  });
}
