import { Hex } from 'viem';
import { supportedChainIds } from './chains';

export const farmAddressesByChainId: {
  [chainId: number]: {
    factory: Hex;
  };
} = {
  [supportedChainIds.mode]: {
    factory: '0x06B79282BA0b442F398443007246CEC43d1833A6',
  },
  [supportedChainIds.bsc]: {
    factory: '0xA2E34eAe3fae892716FF59dc3c9B638a3b762ed9',
  },
  [supportedChainIds.bera]: {
    factory: '0x90d83b3b3844A2A56Dd4a29A42CBc12a4673b4Ea',
  },
};
