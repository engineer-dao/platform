import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { getIPFSData, pinata } from '../../../services/ipfs';
import { validate } from '../../../services/schema/validate';
import { transformIPFStoJob } from '../../../services/schema/transform';
import { middleware } from '../../../middleware/middleware';
import { IIPFSJobMetaData } from '../../../interfaces/IJobData';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

interface Data {
  data?: Record<string, any>;
  message?: string;
  detail?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { cid } = req?.query || {};

  const _cid = Array.isArray(cid) ? cid[0] : cid;

  await middleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!cid) {
    return res.status(422).json({ message: 'Missing CID' });
  }

  const response = await getIPFSData(_cid);

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
