import { Hex } from 'viem';

export type PoolDetails = {
  token0: Hex;
  token1: Hex;
  address: Hex;
  tickSpacing: number;
};
