'use client';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { cookieToInitialState, WagmiProvider } from 'wagmi';
import { getWagmiConfig } from '.';
import { mode } from 'wagmi/chains';
import { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { Provider as ReduxProvider } from 'react-redux';
// import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { FundProvider } from '@/components/dashboard/FundContext';

interface ProviderClientProps {
  wagmiCookie: string | null;
  children: ReactNode;
}

const ProviderClient = ({ wagmiCookie, children }: ProviderClientProps) => {
  const wagmiConfig = useMemo(() => getWagmiConfig(), []);
  const initialWagmiState = useMemo(() => cookieToInitialState(wagmiConfig, wagmiCookie), [wagmiConfig, wagmiCookie]);
  const queryClient = new QueryClient();

  return (
    <ReduxProvider store={store}>
      <WagmiProvider config={wagmiConfig} initialState={initialWagmiState}>
        {/* <SessionProvider session={pageProps.session}> */}
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider initialChain={mode.id}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {/* <Layout font={'fontChoice'}> */}
                <FundProvider>
                  {children}
                </FundProvider>
              {/* </Layout> */}
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
        {/* </SessionProvider> */}
      </WagmiProvider>
    </ReduxProvider>
  );
};

export default ProviderClient;
