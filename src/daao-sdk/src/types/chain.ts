import { Address } from 'viem';

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface DexInfo {
  type: 'Velodrome' | 'Uniswap';
  factoryAddress: Address;
  routerAddress: Address;
  swapRouterAddress: Address;
  quoterAddress: Address;
}

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: NativeCurrency;
  dexInfo: DexInfo;
}

export type SupportedChains = Record<number, ChainConfig>;
