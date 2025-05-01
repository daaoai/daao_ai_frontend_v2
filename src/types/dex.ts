import { Hex } from 'viem';
import { AddLiquidityParams } from './addLiquidity';
import { SupportedDexType } from './chains';

export type DexAddresses = {
  factoryAddress: Hex;
  swapRouterAddress: Hex;
  quoterAddress: Hex;
  nftManager: Hex;
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

export type GetUserNFTIdsRequest = {
  account: Hex;
  chainId: number;
  poolAddress: Hex;
  nftManagerAddress: Hex;
};

export type GetUserNFTsForPoolRequest = GetUserNFTIdsRequest & {
  type: SupportedDexType;
  token0: Hex;
  token1: Hex;
  fee: number;
};

export type GetNFTDetailsRequest = {
  chainId: number;
  nftId: bigint;
  nftManagerAddress: Hex;
};

export type V3Position = {
  id: bigint;
  nonce: bigint;
  operator: Hex;
  token0: Hex;
  token1: Hex;
  tickSpacing: number;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
};

export type V3PoolDetails = {
  token0: Hex;
  token1: Hex;
  fee: number;
  tickSpacing: number;
  slot0: {
    sqrtPriceX96: bigint;
    currentTick: number;
  };
};
export abstract class IDexProtocol {
  abstract factoryAddress: Hex;
  abstract swapRouterAddress: Hex;
  abstract quoterAddress: Hex;
  abstract chainId: number;

  abstract getPoolAddress(args: PoolAddressRequest): Promise<Hex>;
  abstract getV3PoolDetails(address: Hex): Promise<{ token0: Hex; token1: Hex }>;
  abstract fetchQuotes(args: QuotesRequest): Promise<bigint>;
  abstract generateSwapData(args: SwapDataRequest): {
    callData: string;
    to: Hex;
    value: bigint;
  };
}

export abstract class INFTManager {
  abstract getUserNFTIds(args: GetUserNFTIdsRequest): Promise<bigint[]>;
  abstract generateMintCallData(args: AddLiquidityParams): Hex;
  abstract getUserNFTsForPool(args: GetUserNFTsForPoolRequest): Promise<V3Position[]>;
  abstract getNFTDetails(args: GetNFTDetailsRequest): Promise<V3Position>;
}
