import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';
import { bscFunds } from './bsc_funds';
import { modeFunds } from './mode_funds';
import { monadFunds } from './monad_funds';
import { supportedChainIds } from '@/constants/chains';
import { beraFunds } from './bera_funds';

export const fundsByChainId: {
  [chainId: number]: Record<string, FundDetails>;
} = {
  [supportedChainIds.monad]: monadFunds,
  [supportedChainIds.mode]: modeFunds,
  [supportedChainIds.bsc]: bscFunds,
  [supportedChainIds.bera]: beraFunds,
};

export const tbaDaao = (id: string): FundDetails => {
  return {
    id,
    title: 'To Be Announced',
    token: zeroAddress,
    status: 'soon',
    address: zeroAddress,
    imgSrc: '/assets/new-upcoming-img.jpeg',
    dexInfo: {
      fee: 0,
      tickSpacing: 0,
      type: 'uniswap',
    },
  };
};
