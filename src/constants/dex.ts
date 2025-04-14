import { kodiakAddressesByChainId } from '@/dexes/kodiakDex/addresses';
import { pancakeAddressesByChainId } from '@/dexes/pancake/addresses';
import { pancakeChainSlugMap } from '@/dexes/pancake/chainMap';
import { customDexAddressesByChainId } from '@/dexes/UniswapCustomRouter/addresses';
import { uniswapChainSlugMap } from '@/dexes/UniswapCustomRouter/chainMap';
import { velodromeCustomDexAddressesByChainId } from '@/dexes/velodromeCustomRouter/addresses';
import { velodromeChainSlugMap } from '@/dexes/velodromeCustomRouter/chainMap';
import { SupportedDexType } from '@/types/chains';
import { DexAddresses } from '@/types/dex';
import { Url } from 'url';

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

// https://velodrome.finance/swap?from=0xdfc7c877a950e49d2610114102175a06c2e3167a&to=0x98e0ad23382184338ddcec0e13685358ef845f30&chain0=34443&chain1=34443
// https://app.uniswap.org/swap?chain=mainnet&inputCurrency=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
// https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x683e9dCf085E5efCc7925858aAcE94D4b8882024&outputCurrency=0xa25896B34C9ea0A3dA53Ca0640BF6b5772e0bF2D
// https://app.kodiak.finance/#/swap?inputCurrency=0x6969696969696969696969696969696969696969&outputCurrency=0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce

const getDexChainSlug = (chainId: number, type: SupportedDexType) => {
  switch (type) {
    case supportedDexesTypes.uniswapCustomRouter:
      return uniswapChainSlugMap[chainId];
    case supportedDexesTypes.velodromeCustomRouter:
      return velodromeChainSlugMap[chainId];
    case supportedDexesTypes.pancake:
      return pancakeChainSlugMap[chainId];
    default:
      throw new Error(`Unsupported DEX type: ${type}`);
  }
};

export const getDexURL = ({
  chainId,
  type,
  paymentToken,
  daaoToken,
}: {
  chainId: number;
  type: SupportedDexType;
  paymentToken: string;
  daaoToken: string;
}) => {
  switch (type) {
    case supportedDexesTypes.uniswapCustomRouter:
      return `https://app.uniswap.org/#/swap?chain=${getDexChainSlug(chainId, type)}&inputCurrency=${paymentToken}&outputCurrency=${daaoToken}`;
    case supportedDexesTypes.velodromeCustomRouter:
      return `https://velodrome.finance/swap?from=${paymentToken}&to=${daaoToken}&chain0=${chainId}&chain1=${chainId}`;
    case supportedDexesTypes.pancake:
      return `https://pancakeswap.finance/swap?chain=${getDexChainSlug(chainId, type)}&inputCurrency=${paymentToken}&outputCurrency=${daaoToken}`;
    case supportedDexesTypes.kodiak:
      return `https://app.kodiak.finance/#/swap?inputCurrency=${paymentToken}&outputCurrency=${daaoToken}`;
    default:
      return '';
  }
};

export const getDexName = (type: SupportedDexType) => {
  switch (type) {
    case supportedDexesTypes.uniswapCustomRouter:
      return 'Uniswap';
    case supportedDexesTypes.velodromeCustomRouter:
      return 'Velodrome';
    case supportedDexesTypes.pancake:
      return 'Pancake';
    case supportedDexesTypes.kodiak:
      return 'Kodiak';
    default:
      '';
  }
};
