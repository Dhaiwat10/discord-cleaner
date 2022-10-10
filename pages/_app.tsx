import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({
  Component,
  // @ts-expect-error
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
