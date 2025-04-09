import { supportedChainIds } from '@/constants/chains';
import { FundDetails } from '@/types/daao';
import { zeroAddress } from 'viem';
import { modeFunds } from './mode_funds';
import { monadFunds } from './monad_funds';
import { bscFunds } from './bsc_funds';

export const fundsByChainId: {
  [chainId: number]: Record<string, FundDetails>;
} = {
  [supportedChainIds.monad]: monadFunds,
  [supportedChainIds.mode]: modeFunds,
  [supportedChainIds.bsc]: bscFunds,
};

export const tbaDaao = (id: string): FundDetails => {
  return {
    id,
    title: 'To Be Announced',
    token: zeroAddress,
    status: 'soon',
    address: zeroAddress,
    imgSrc: '/assets/new-upcoming-img.jpeg',
  };
};
