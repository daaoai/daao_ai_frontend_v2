import { supportedChainIds, viemChainsById } from '@/constants/chains';
import { Chain } from 'viem';

export const getViemChainById = (chainId: number): Chain => {
  return viemChainsById[chainId];
};

export const isChainIdSupported = (chainId: number): boolean => {
  return Object.values(supportedChainIds).includes(chainId);
};
