import { Hex } from 'viem';

export type AddLiquidityParams = {
  token0: Hex;
  token1: Hex;
  fee: number;
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  amount0Desired: bigint;
  amount1Desired: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
  recipient: Hex;
  deadline: bigint;
  sqrtPriceX96: bigint;
};
