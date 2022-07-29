require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import activity_message from './api/activity/message';
import sync_events from './api/activity/syncEvents';
import get from './api/cache/get';
import add_job from './api/ipfs/add-job';
import add_report from './api/ipfs/add-report';
import ipfs_get from './api/ipfs/get';

const app = express();

if (!process.env.CORS_ORIGIN) {
  throw new Error('Missing CORS_ORIGIN environment variable');
}

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));

app.get('/api/activity/message', activity_message);
app.get('/api/activity/sync-events', sync_events);
app.get('/api/cache/get', get);
app.get('/api/ipfs/add_job', add_job);
app.get('/api/ipfs/add_report', add_report);
app.get('/api/ipfs/ipfs_get', ipfs_get);

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

app.listen(3001);

console.log('Listening on http://localhost:3001');
