import { Address, Hex } from 'viem';
import { Token } from './chains';

export interface PoolRewards {
  tokenAddress: string;
  rewards: bigint;
  remainingRewards: bigint;
  accRewards: bigint;
}

export interface UserInfo {
  stakedAmount: bigint;
  rewardDebt: bigint;
}

export interface FarmPool {
  startTime: bigint;
  endTime: bigint;
  totalStakedAmount: bigint;
  totalStakedUSD: number;
  rewards: PoolRewards;
  rewardTokenPerSec: bigint;
  poolAddress: Hex;
  userInfo: UserInfo;
  unclaimedReward: bigint;
  apr: number;
  depositTokenDetails: Token;
  rewardTokenDetails: Token;
}

export interface Position {
  nonce: bigint;
  operator: Address;
  token0: Address;
  token1: Address;
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  liquidityUsd: string;
  id: number;
  apr: number;
  rewardInfo: bigint;
  numberOfStakes: number;
}
