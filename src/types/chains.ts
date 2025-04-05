import { supportedChainIds } from '@/constants/chains';
import { supportedDexesTypes } from '@/constants/dex';
import { Hex } from 'viem';

export type SupportedChain = (typeof supportedChainIds)[keyof typeof supportedChainIds];

export type SupportedDexType = keyof typeof supportedDexesTypes;

export type Token = {
  address: Hex;
  decimals: number;
  symbol: string;
  name: string;
  logo?: string;
};

export type ChainsConfig = {
  id: number;
  name: string;
  rpcUrls: string[];
  blockExplorer: string;
  contribution: {
    token: Token;
    minAmount: bigint;
    maxAmount: bigint;
  };
  daoAddress: Hex;
  nativeCurrency: Token;
  wnativeToken: Token;
  dexInfo: {
    type: SupportedDexType;
    factoryAddress: Hex;
    swapRouterAddress: Hex;
    quoterAddress: Hex;
  };
};
