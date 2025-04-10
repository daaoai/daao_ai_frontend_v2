import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';

export const monadFunds: Record<string, FundDetails> = {
  '0x61d4B36dC50Fd637f162f2cd1667e6F0FC2Fb9Da': {
    id: '1',
    title: 'Sorcerer',
    address: '0x61d4B36dC50Fd637f162f2cd1667e6F0FC2Fb9Da',
    token: zeroAddress,
    imgSrc: '/assets/daao-monad.svg',
    status: 'trading',
    dexInfo: {
      type: supportedDexesTypes.uniswap,
      fee: 10000,
      tickSpacing: 200,
    },
  },
};
