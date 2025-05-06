import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';

export const monadFunds: Record<string, FundDetails> = {
  '0x82A613C19787D88d648C04F8Ad7Bd6825193e317': {
    id: '1',
    title: 'Sorcerer',
    description:
      'DeFAI Venture DAO is a DeFAI Investment DAO dedicated to advancing the DeFAI movement by strategically investing in AI Agents and AI-focused DAOs on Monad. As a collective force in decentralized AI finance, $MON empowers the AI-driven movement on Monad, fostering the growth of autonomous, AI-powered ecosystems.',
    address: '0x82A613C19787D88d648C04F8Ad7Bd6825193e317',
    token: zeroAddress,
    imgSrc: '/assets/daao-monad.svg',
    status: 'trading',
    dexInfo: {
      type: supportedDexesTypes.uniswapCustomRouter,
      fee: 10000,
      tickSpacing: 200,
    },
  },
};
