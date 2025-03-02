import '../globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import { FundProvider } from '../components/dashboard/FundContext';
import { getWagmiConfig } from '@/wagmi';
import { ThemeProvider } from '@/components/theme-provider';

const client = new QueryClient();
const config = getWagmiConfig();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Rainbowkit with Ethereum',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={client}>
          {/* <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}> */}
            <RainbowKitProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                <Layout font={'fontChoice'}>
                  <FundProvider>
                    <Component {...pageProps} />
                  </FundProvider>
                </Layout>
              </ThemeProvider>
            </RainbowKitProvider>
          {/* </RainbowKitSiweNextAuthProvider> */}
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}

function Layout({ children, font }: { children: React.ReactNode; font?: string }) {
  return <div className={font}>{children}</div>;
}

export default MyApp;
