import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';

export const bscFunds: Record<string, FundDetails> = {
  '0x273cfA50190358639ea7ab3e6bF9c91252132338': {
    id: '1',
    title: 'CAKE DAAO',
    token: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    address: '0x273cfA50190358639ea7ab3e6bF9c91252132338',
    imgSrc: '/assets/assassins.webp',
    status: 'trading',
    dexInfo: {
      type: supportedDexesTypes.pancake,
      fee: 10000,
      tickSpacing: 200,
    },
  },
};
