import { Request, Response } from 'express';
import { syncContractEvents } from '../../util/activityFeedSync';

export default async function handler(req: Request, res: Response) {
  // refresh contract events
  await syncContractEvents();

  res.status(200).json({ message: 'Success' });
}
