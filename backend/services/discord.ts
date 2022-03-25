import { TextChannel, Client, Intents } from 'discord.js';

export const postReport = (url: string, reason: string) => {
  const message = `🚨 New Report! 🚨 \n\n **Job:** ${url} \n **Message:** ${reason}`;

  postToSupportChannel(message);
};

export const postToSupportChannel = async (message: string) => {
  if (!process.env.DISCORD_API_KEY) {
    throw new Error('Missing Discord API key.');
  }

  const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
  });

  client.on('ready', (client) => {
    client.channels.fetch('956396990076444752').then((channel: any) => {
      return (channel as TextChannel)?.send(message);
    });
  });

  client.login(process.env.DISCORD_API_KEY);
};
