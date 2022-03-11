import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { syncContractEvents } from 'util/activityFeedSync';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type ResponseMessage = {
  message: string;
};

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse<ResponseMessage>,
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
  res: NextApiResponse<ResponseMessage>
) {
  await runMiddleware(req, res, cors);

  // refresh contract events
  await syncContractEvents();

  res.status(200).json({ message: 'Success' });
}
