// Code in this file is based on https://docs.login.xyz/integrations/nextauth.js
// with added process.env.VERCEL_URL detection to support preview deployments
// and with auth option logic extracted into a 'getAuthOptions' function so it
// can be used to get the session server-side with 'getServerSession'
import { IncomingMessage } from 'http';
import { NextApiRequest, NextApiResponse } from 'next/types';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
// https://next-auth.js.org/tutorials/securing-pages-and-api-routes

export function getAuthOptions(req: IncomingMessage): NextAuthOptions {
  const providers = [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'));

          const nextAuthUrl =
            process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
          if (!nextAuthUrl) {
            return null;
          }
          console.log('nextAuthUrl', nextAuthUrl);

          const nextAuthHost = new URL(nextAuthUrl).host;
          console.log('nextAuthHost', nextAuthHost);
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req: { headers: req.headers } }))) {
            return null;
          }

          await siwe.verify({ signature: credentials?.signature || '' });

          /**
           * You can add your own logic here to handle user after sign in.
           */

          return {
            id: siwe.address,
          };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
      credentials: {
        message: {
          label: 'Message',
          placeholder: '0x0',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          placeholder: '0x0',
          type: 'text',
        },
      },
      name: 'Ethereum',
    }),
  ];

  return {
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub;
        session.user = {
          name: token.sub,
        };
        session.user.image = 'https://www.fillmurray.com/128/128';
        return session;
      },
    },
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
  };
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const authOptions = getAuthOptions(req);

  if (!Array.isArray(req.query.nextauth)) {
    res.status(400).send('Bad request');
    return;
  }

  const isDefaultSigninPage = req.method === 'GET' && req.query.nextauth.find((value: any) => value === 'signin');

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    authOptions.providers.pop();
  }

  return await NextAuth(req, res, authOptions);
}
