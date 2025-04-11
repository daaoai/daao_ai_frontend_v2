import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';

export const bscFunds: Record<string, FundDetails> = {
  '0x08Bd99E710D352B3435B0c52FDa5185eDCE465fe': {
    id: '1',
    title: 'CAKE DAAO',
    token: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    address: '0x08Bd99E710D352B3435B0c52FDa5185eDCE465fe',
    imgSrc: '/assets/assassins.webp',
    status: 'trading',
    dexInfo: {
      type: supportedDexesTypes.pancake,
      fee: 10000,
      tickSpacing: 200,
    },
  },
};
