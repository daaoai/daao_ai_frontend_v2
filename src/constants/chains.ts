import * as viemChains from 'viem/chains';

export const supportedChainIds = {
  bsc: 56,
  mode: 34443,
  monad: 10143,
};

export const viemChainsById: Record<number, viemChains.Chain> = Object.values(viemChains).reduce((acc, chainData) => {
  return chainData.id
    ? {
        ...acc,
        [chainData.id]: chainData,
      }
    : acc;
}, {});
