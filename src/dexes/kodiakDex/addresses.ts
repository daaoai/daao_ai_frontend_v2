import { supportedChainIds } from '@/constants/chains';
import { DexAddresses } from '@/types/dex';

export const kodiakAddressesByChainId: Record<number, DexAddresses> = {
  [supportedChainIds.bera]: {
    factoryAddress: '0xD84CBf0B02636E7f53dB9E5e45A616E05d710990',
    swapRouterAddress: '0xe301E48F77963D3F7DbD2a4796962Bd7f3867Fb4',
    quoterAddress: '0x644C8D6E501f7C994B74F5ceA96abe65d0BA662B',
    nftManager: '0xFE5E8C83FFE4d9627A75EaA7Fee864768dB989bD',
  },
};
