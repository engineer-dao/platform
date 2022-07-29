import { Request, Response } from 'express';
import { getIPFSfromCache } from '../../services/cache';

export default async function handler(req: Request, res: Response) {
  const cid = (req as any)?.query?.cid;

  if (!cid) {
    res.status(400).json({ message: 'CID Missing' });
  }

  console.log(`Getting IPFS from cache for CID: ${cid}`);

  try {
    const data = await getIPFSfromCache(cid);

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
