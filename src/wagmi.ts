import {
  getDefaultConfig,
  connectorsForWallets,

} from '@rainbow-me/rainbowkit';
import { modeTestnet,sepolia,mainnet } from 'wagmi/chains';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http, createConfig } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [modeTestnet,sepolia],
  ssr: true,
  // transports: {
  //   [mainnet.id]: http(),
  //   [sepolia.id]: http(),
  //   [mode.id]: http(),
  // },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
});