import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";
import { Syne_Mono, Goldman } from "next/font/google";

// Define font instances
const syneMono = Syne_Mono({
  subsets: ["latin"],
  weight: "400",
});

const goldman = Goldman({
  subsets: ["latin"],
  weight: "400",
});

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

const client = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to Rainbowkit with Ethereum",
});

// TODO: wagmi to change default theme based on the user's system preference

function MyApp({ Component, pageProps }: AppProps) {
  const fontChoice = pageProps.useSyneMono ? syneMono.className : goldman.className;


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
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Layout font={fontChoice}>
                  <Component {...pageProps} />
                </Layout>
              </ThemeProvider>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}

function Layout({ children, font, subdomain }: { children: React.ReactNode; font?: string, subdomain?: string }) {
  console.log('Subdomain:', subdomain);  // Log to check if it is passed correctly
  return (
    <div className={font || goldman.className}>
      {children}
    </div>
  );
}

export default MyApp;
