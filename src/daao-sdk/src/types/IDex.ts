import { Address } from 'viem';

export interface SwapParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  recipient: Address;
  slippage: number;
}

export interface LiquidityParams {
  token0: Address;
  token1: Address;
  amount0: bigint;
  amount1: bigint;
  recipient: Address;
}

export interface IDex {
  getQuote(params: Omit<SwapParams, 'slippage'>): Promise<bigint>;
  swap(params: SwapParams): Promise<`0x${string}`>; // Returns transaction hash
  addLiquidity(params: LiquidityParams): Promise<`0x${string}`>;
  removeLiquidity(positionId: string): Promise<`0x${string}`>;
  getPairAddress(token0: Address, token1: Address): Promise<Address>;
}
