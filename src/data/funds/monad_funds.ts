import { supportedDexesTypes } from '@/constants/dex';
import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';

export const monadFunds: Record<string, FundDetails> = {
  '0x82A613C19787D88d648C04F8Ad7Bd6825193e317': {
    id: '1',
    title: 'Sorcerer',
    address: '0x82A613C19787D88d648C04F8Ad7Bd6825193e317',
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
