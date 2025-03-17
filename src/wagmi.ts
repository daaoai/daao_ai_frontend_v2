import { getDefaultConfig, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { scroll, mainnet } from "wagmi/chains";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http, createConfig } from "wagmi";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [scroll],
  ssr: true,

  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  transports: {
    [scroll.id]: http(scroll.rpcUrls.default.http[0]), // Ensure RPC is set correctly
  },
});
