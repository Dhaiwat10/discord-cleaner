import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tokenRes = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET as string,
  });
  const accessToken = tokenRes?.accessToken as string;
  const tokenType = tokenRes?.tokenType as string;

  // fetch all the guilds the user is in via the discord API
  const guilds = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  }).then((res) => res.json());

  res.status(200).json({ guilds });
}
