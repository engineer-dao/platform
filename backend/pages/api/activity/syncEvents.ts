import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import { throttle } from 'throttle-debounce';
import { syncContractEvents } from 'util/activityFeedSync';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type ResponseMessage = {
  message: string;
};

// Wait at least 3 seconds between refresh requests
const THROTTLE_DELAY = 3000;
const syncContractEventsWithThrottle = throttle(
  THROTTLE_DELAY,
  syncContractEvents
);

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

  // refresh contract events in the background
  syncContractEventsWithThrottle();

  res.status(200).json({ message: 'Success' });
}
