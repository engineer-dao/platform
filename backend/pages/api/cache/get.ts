import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { middleware } from '../../../middleware/middleware';
import { getIPFSfromCache } from '../../../services/cache';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await middleware(req, res, cors);

  const cid = (req as any)?.query?.cid;

  if (!cid) {
    res.status(400).json({ message: 'CID Missing' });
  }

  try {
    const data = await getIPFSfromCache(cid);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
