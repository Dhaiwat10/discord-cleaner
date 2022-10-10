import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const leaveGuild = (
  guildId: string,
  tokenType: string,
  accessToken: string
) => {
  return fetch(`https://discord.com/api/users/@me/guilds/${guildId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  }).then((res) => res.json());
};

const leaveGuilds = async (
  guildIds: string[],
  tokenType: string,
  accessToken: string
) => {
  const promises = guildIds.map((guildId) =>
    leaveGuild(guildId, tokenType, accessToken)
  );
  return Promise.all(promises);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const tokenRes = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET as string,
    });
    const accessToken = tokenRes?.accessToken as string;
    const tokenType = tokenRes?.tokenType as string;

    const guildIds = req.body.guildIds as string[];

    const response = await leaveGuilds(guildIds, tokenType, accessToken);

    res.status(200).json({ response });
  } else {
    // send method not allowed error
    res.status(405).json({ error: 'Method not allowed' });
  }
}
