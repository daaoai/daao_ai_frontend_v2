import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';

export const beraFunds: Record<string, FundDetails> = {
  '0x402f35e11cC6E89E80EFF4205956716aCd94be04': {
    id: '1',
    title: 'BERA DAAO',
    description:
      'DeFAI Venture DAO is a DeFAI Investment DAO dedicated to advancing the DeFAI movement by strategically investing in AI Agents and AI-focused DAOs on Bera. As a collective force in decentralized AI finance, $BERA empowers the AI-driven movement on Bera, fostering the growth of autonomous, AI-powered ecosystems.',
    address: '0x402f35e11cC6E89E80EFF4205956716aCd94be04',
    token: zeroAddress,
    imgSrc: '/assets/berachain.svg',
    status: 'trading',
    isManageLiquidityEnabled: true,
    dexInfo: {
      type: supportedDexesTypes.kodiak,
      fee: 10000,
      tickSpacing: 200,
    },
  },
};
