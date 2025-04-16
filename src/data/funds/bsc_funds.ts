import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';

export const bscFunds: Record<string, FundDetails> = {
  '0x08Bd99E710D352B3435B0c52FDa5185eDCE465fe': {
    id: '1',
    title: 'CAKE DAAO',
    description:
      'DeFAI Venture DAO is a DeFAI Investment DAO dedicated to advancing the DeFAI movement by strategically investing in AI Agents and AI-focused DAOs on BSC. As a collective force in decentralized AI finance, $CAKE empowers the AI-driven movement on BSC, fostering the growth of autonomous, AI-powered ecosystems.',
    token: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    address: '0x08Bd99E710D352B3435B0c52FDa5185eDCE465fe',
    imgSrc: '/assets/assassins.webp',
    status: 'trading',
    isManageLiquidityEnabled: true,
    dexInfo: {
      type: supportedDexesTypes.pancake,
      fee: 10000,
      tickSpacing: 200,
    },
  },
};
