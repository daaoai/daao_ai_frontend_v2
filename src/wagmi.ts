import {
  getDefaultConfig,
  connectorsForWallets,

} from '@rainbow-me/rainbowkit';
import { mode , mainnet} from 'wagmi/chains';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet
} from '@rainbow-me/rainbowkit/wallets';
import { http, createConfig } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mode],
  ssr: true,
  
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        injectedWallet
        
      ],
    },
  ],
  transports: {
    [mode.id]: http(mode.rpcUrls.default.http[0]), // Ensure RPC is set correctly
  },
  
});
