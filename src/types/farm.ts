import { Hex } from 'viem';

export interface PoolRewards {
  tokenAddress: string;
  rewards: bigint;
  remainingRewards: bigint;
  accRewards: bigint;
}

export interface UserInfo {
  stackedAmount: bigint;
  rewardDebt: bigint;
}

export interface FarmPool {
  startTime: bigint;
  endTime: bigint;
  totalStackedAmount: bigint;
  totalStackedUSD: number;
  rewards: PoolRewards;
  rewardTokenPerSec: bigint;
  depositToken: Hex;
  poolAddress: Hex;
  userInfo: UserInfo;
  unclaimedReward: bigint;
  apr: number;
}
