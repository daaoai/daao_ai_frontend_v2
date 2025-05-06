import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';

export const modeFunds: Record<string, FundDetails> = {
  '0xEc7b0FD288E87eBC1C301E360092c645567e79B9': {
    id: '1',
    description:
      'DeFAI Venture DAO is a DeFAI Investment DAO dedicated to advancing the DeFAI movement by strategically investing in AI Agents and AI-focused DAOs on Mode. As a collective force in decentralized AI finance, $CARTEL empowers the AI-driven movement on Mode, fostering the growth of autonomous, AI-powered ecosystems.',
    title: 'DeFAI Cartel',
    token: '0x98E0AD23382184338dDcEC0E13685358EF845f30',
    address: '0xEc7b0FD288E87eBC1C301E360092c645567e79B9',
    imgSrc: '/assets/defaiCartel.svg',
    status: 'trading',
    dexInfo: {
      type: supportedDexesTypes.velodromeCustomRouter,
      fee: 10000,
      tickSpacing: 100,
    },
    isLpFarmsEnabled: true,
    isManageLiquidityEnabled: true,
  },
};
