import { Hex } from 'viem';

export type DexAddresses = {
  factoryAddress: Hex;
  swapRouterAddress: Hex;
  quoterAddress: Hex;
};

export type QuotesRequest = {
  tokenIn: Hex;
  tokenOut: Hex;
  fee: number;
  poolAddress: Hex;
  amount: bigint;
  sqrtPrice: bigint;
  zeroToOne: boolean;
};

export type SwapDataRequest = {
  poolAddress: Hex;
  tokenIn: Hex;
  tokenOut: Hex;
  fee: number;
  recipient: Hex;
  zeroToOne: boolean;
  amount: bigint;
  minAmount: bigint;
  deadline: bigint;
  sqrtPrice: bigint;
};

export type PoolAddressRequest = {
  token0: Hex;
  token1: Hex;
  fee: number;
  tickSpacing: number;
};

export abstract class DexProtocol {
  abstract factoryAddress: Hex;
  abstract swapRouterAddress: Hex;
  abstract quoterAddress: Hex;
  abstract chainId: number;

  abstract getPoolAddress(args: PoolAddressRequest): Promise<Hex>;
  abstract getPoolDetails(address: Hex): Promise<{ token0: Hex; token1: Hex }>;
  abstract fetchQuotes(args: QuotesRequest): Promise<bigint>;
  abstract generateSwapData(args: SwapDataRequest): {
    callData: string;
    to: Hex;
    value: bigint;
  };
}
