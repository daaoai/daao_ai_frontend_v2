import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';

export const beraFunds: Record<string, FundDetails> = {
  '0x402f35e11cC6E89E80EFF4205956716aCd94be04': {
    id: '1',
    title: 'BERA DAAO',
    address: '0x402f35e11cC6E89E80EFF4205956716aCd94be04',
    token: zeroAddress,
    imgSrc: '/assets/batman.jpg',
    status: 'trading',
    dexInfo: {
      type: supportedDexesTypes.kodiak,
      fee: 10000,
      tickSpacing: 200,
    },
  },
};
