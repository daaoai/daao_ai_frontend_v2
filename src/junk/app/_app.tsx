import '../styles/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';
import { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';

const client = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Rainbowkit with Ethereum',
});
import { getWagmiConfig } from '@/wagmi';
import { FundProvider } from '@/components/dashboard/FundContext';

// TODO: wagmi to change default theme based on the user's system preference

function MyApp({ Component, pageProps }: AppProps) {
  // const config = getWagmiConfig();

  return (
    <WagmiProvider config={getWagmiConfig()}>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={client}>
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                <Layout>
                  <FundProvider>
                    <Component {...pageProps} />
                  </FundProvider>
                </Layout>
              </ThemeProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}

function Layout({ children, font }: { children: React.ReactNode; font?: string }) {
  return <div className={font}>{children}</div>;
}

export default MyApp;
