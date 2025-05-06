import { Hex } from 'viem';
import { V3PoolDetails } from './dex';
import { Token } from './chains';

export type PoolDetails = {
  token0: Hex;
  token1: Hex;
  address: Hex;
  tickSpacing: number;
};

export type V3PoolDetailedDetails = V3PoolDetails & {
  token0Details: Token & {
    price: number;
  };
  token1Details: Token & {
    price: number;
  };
};
