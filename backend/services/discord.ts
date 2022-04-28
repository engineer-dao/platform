import { Channel, TextChannel, Client, Intents } from 'discord.js';

export const shouldNotifyAboutEvent = (eventType: string) => {
  switch (eventType) {
    case 'JobPosted':
    case 'JobStarted':
    case 'JobCompleted':
    case 'JobApproved':
    case 'JobCanceled':
    case 'JobClosed':
    case 'JobClosedByEngineer':
    case 'JobClosedBySupplier':
    case 'JobDelisted':
    case 'JobDisputeResolved':
    case 'JobDisputed':
    case 'JobReported':
    case 'JobReportDeclined':
    case 'JobTimeoutPayout':
      return true;
  }
  return false;
};

export const notifyEvent = async (
  eventType: string,
  args: any,
  blockNumber: number,
  jobId: string
) => {
  switch (eventType) {
    case 'JobReported':
      return await postReport(jobId, blockNumber, args.metadataCid);
      return;
    case 'JobPosted':
    case 'JobStarted':
    case 'JobCompleted':
    case 'JobApproved':
    case 'JobCanceled':
    case 'JobClosed':
    case 'JobClosedByEngineer':
    case 'JobClosedBySupplier':
    case 'JobDelisted':
    case 'JobDisputeResolved':
    case 'JobDisputed':
    case 'JobReportDeclined':
    case 'JobTimeoutPayout':
      return await postGenericActivityFeedEvent(eventType, jobId, blockNumber);
      return;
  }
};

const postReport = async (
  jobId: string,
  blockNumber: number,
  reasonCid: string
) => {
  const siteUrl = process.env.SITE_URL || 'https://stablework.app';
  const message = `🚨 New Report! 🚨 \n\n **Job:** ${siteUrl}/contract/${jobId}\n **Reason Data:** https://gateway.pinata.cloud/ipfs/${reasonCid}\n **Block Number:** ${blockNumber}`;

  await postToSupportChannel(message);
};

export const postToSupportChannel = async (message: string) => {
  const channelId = process.env.DISCORD_SUPPORT_CHANNEL;
  if (!channelId) {
    return;
  }

  return await postToChannel(message, channelId);
};

const postGenericActivityFeedEvent = async (
  eventType: string,
  jobId: string,
  blockNumber: number
) => {
  const channelId = process.env.DISCORD_FEED_CHANNEL;
  if (!channelId) {
    return;
  }
  const siteUrl = process.env.SITE_URL || 'https://stablework.app';
  const message = `⚙️ ${eventType}\n**Job:** ${siteUrl}/contract/${jobId}\n**Block Number:** ${blockNumber}`;

  return await postToChannel(message, channelId);
};

const postToChannel = async (message: string, channelId: string) => {
  if (!process.env.DISCORD_API_KEY) {
    throw new Error('Missing Discord API key.');
  }

  const client = new Client();

  return new Promise((resolve, reject) => {
    client.on('ready', () => {
      try {
        client.channels.fetch(channelId).then((channel: Channel) => {
          resolve((channel as TextChannel)?.send(message));
        });
      } catch (e) {
        reject(e);
      }
    });

    client.login(process.env.DISCORD_API_KEY);
  });
};
