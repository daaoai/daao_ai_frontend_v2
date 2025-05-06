import { Address, Hex } from 'viem';
import { Token } from './chains';
import { V3PoolDetailedDetails } from './pool';

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
  token0: Hex;
  token1: Hex;
  token0Details: Token;
  token1Details: Token;
  liquidityUsd: string;
  id: number;
  apr: number;
  rewardInfo: bigint;
  numberOfStakes: number;
}

export interface LPFarm extends V3PoolDetailedDetails {
  rewardTokenDetails: Token;
  dexType: string;
  address: Hex;
  unclaimedRewardsUSD: number;
}
