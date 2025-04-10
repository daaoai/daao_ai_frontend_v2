import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';

export const modeFunds: Record<string, FundDetails> = {
  '0xEc7b0FD288E87eBC1C301E360092c645567e79B9': {
    id: '1',
    title: 'DeFAI Cartel',
    token: '0x98E0AD23382184338dDcEC0E13685358EF845f30',
    address: '0xEc7b0FD288E87eBC1C301E360092c645567e79B9',
    imgSrc: '/assets/defaiCartel.svg',
    status: 'trading',
    dexInfo: {
      type: supportedDexesTypes.velodrome,
      fee: 10000,
      tickSpacing: 100,
    },
  },
};
