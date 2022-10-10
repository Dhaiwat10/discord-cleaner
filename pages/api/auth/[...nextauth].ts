import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import DiscordProvider from 'next-auth/providers/discord';

// all the discord oauth2 scopes
const scopes = [
  'identify',
  // 'email',
  // 'connections',
  'guilds',
  // 'guilds.join',
  // 'guilds.members.read',
  // 'gdm.join',
  // 'rpc',
  // 'rpc.notifications.read',
  // 'rpc.voice.read',
  // 'rpc.voice.write',
  // 'rpc.activities.write',
  // 'bot',
  // 'webhook.incoming',
  // 'messages.read',
  // 'applications.builds.upload',
  // 'applications.builds.read',
  // 'applications.commands',
  // 'applications.store.update',
  // 'applications.entitlements',
  // 'activities.read',
  // 'activities.write',
  // 'relationships.read',
  // 'voice',
  // 'dm_channels.read',
].join(' ');

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: scopes } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      if (user && account && account.provider === 'discord') {
        token.username = profile?.name;
        token.accessToken = account.access_token;
        token.tokenType = account.token_type;
      }

      return Promise.resolve(token);
    },
  },
};

export default NextAuth(authOptions);
