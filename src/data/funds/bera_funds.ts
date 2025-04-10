import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';

export const beraFunds: Record<string, FundDetails> = {
  '0x273cfA50190358639ea7ab3e6bF9c91252132338': {
    id: '1',
    title: 'BERA DAAO',
    address: '0x273cfA50190358639ea7ab3e6bF9c91252132338',
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
