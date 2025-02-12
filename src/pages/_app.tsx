import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";

import { config } from "../wagmi";

import { ThemeProvider } from "@/components/theme-provider";
import { gold, syne } from "@/lib/fonts";

const client = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Rainbowkit with Ethereum",
});
import { FundProvider } from "../components/dashboard/FundContext";

// TODO: wagmi to change default theme based on the user's system preference

function MyApp({ Component, pageProps }: AppProps) {
  const fontChoice = pageProps.useSyneMono ? syne.className : gold.className;
  console.log('Mode chain ID', config);

  return (
    <WagmiProvider config={config}>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={client}>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <Layout font={fontChoice}>
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
  return (
    <div className={font || gold.className}>
      {children}
    </div>
  );
}

export default MyApp;
