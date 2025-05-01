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
