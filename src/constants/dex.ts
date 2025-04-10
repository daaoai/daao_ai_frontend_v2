import { kodiakAddressesByChainId } from '@/dexes/kodiakDex/addresses';
import { pancakeAddressesByChainId } from '@/dexes/pancake/addresses';
import { uniswapAddressesByChainId } from '@/dexes/uniswap/addresses';
import { velodromeAddressesByChainId } from '@/dexes/velodrome/addresses';
import { SupportedDexType } from '@/types/chains';
import { DexAddresses } from '@/types/dex';

export const supportedDexesTypes = {
  uniswap: 'uniswap',
  velodrome: 'velodrome',
  pancake: 'pancake',
  kodiak: 'kodiak',
} as const;

export const getDexAddressesForChain = (chainId: number, type: SupportedDexType): DexAddresses => {
  switch (type) {
    case supportedDexesTypes.uniswap:
      return uniswapAddressesByChainId[chainId];
    case supportedDexesTypes.velodrome:
      return velodromeAddressesByChainId[chainId];
    case supportedDexesTypes.pancake:
      return pancakeAddressesByChainId[chainId];
    case supportedDexesTypes.kodiak:
      return kodiakAddressesByChainId[chainId]; // Assuming Kodiak uses Uniswap addresses
    default:
      throw new Error(`Unsupported DEX type: ${type}`);
  }
};
