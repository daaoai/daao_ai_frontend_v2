import { kodiakAddressesByChainId } from '@/dexes/kodiakDex/addresses';
import { pancakeAddressesByChainId } from '@/dexes/pancake/addresses';
import { customDexAddressesByChainId } from '@/dexes/UniswapCustomRouter/addresses';
import { velodromeCustomDexAddressesByChainId } from '@/dexes/velodromeCustomRouter/addresses';
import { SupportedDexType } from '@/types/chains';
import { DexAddresses } from '@/types/dex';

export const supportedDexesTypes = {
  uniswapCustomRouter: 'uniswapCustomRouter',
  velodromeCustomRouter: 'velodromeCustomRouter',
  pancake: 'pancake',
  kodiak: 'kodiak',
} as const;

export const getDexAddressesForChain = (chainId: number, type: SupportedDexType): DexAddresses => {
  switch (type) {
    case supportedDexesTypes.uniswapCustomRouter:
      return customDexAddressesByChainId[chainId];
    case supportedDexesTypes.velodromeCustomRouter:
      return velodromeCustomDexAddressesByChainId[chainId];
    case supportedDexesTypes.pancake:
      return pancakeAddressesByChainId[chainId];
    case supportedDexesTypes.kodiak:
      return kodiakAddressesByChainId[chainId];
    default:
      throw new Error(`Unsupported DEX type: ${type}`);
  }
};
