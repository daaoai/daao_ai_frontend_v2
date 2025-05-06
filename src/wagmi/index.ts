'use client';
import { chainsData, supportedChainIds } from '@/constants/chains';
import { POLLING_INTERVAL } from '@/constants/wagmi';
import { getViemChainById } from '@/utils/chains';
import { Chain, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  frontierWallet,
  metaMaskWallet,
  okxWallet,
  phantomWallet,
  safepalWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { HttpTransport } from 'viem';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        trustWallet,
        frontierWallet,
        safepalWallet,
        phantomWallet,
        okxWallet,
      ],
    },
  ],
  { appName: 'Daao.ai', projectId: '762399822f3c6326e60b27c2c2085d52' },
);

export type CustomWagmiChain = {
  iconUrl: string;
} & Chain;

const chains: CustomWagmiChain[] = Object.values(supportedChainIds).map((chainId) => {
  const viemChain = getViemChainById(chainId);
  return {
    ...viemChain,
    iconUrl: chainsData[chainId].logo,
  };
});

const transports = Object.values(supportedChainIds).reduce((acc, chainId) => {
  const viemChain = getViemChainById(chainId);
  return {
    ...acc,
    [viemChain.id]: http(),
  };
}, {} as Record<number, HttpTransport>);

export const getWagmiConfig = () => {
  return createConfig({
    chains: chains as [CustomWagmiChain, ...CustomWagmiChain[]],
    storage: createStorage({
      storage: cookieStorage,
    }),
    pollingInterval: POLLING_INTERVAL.ms1500,
    syncConnectedChain: true,
    transports: transports,
    ssr: true,
    connectors,
  });
};
