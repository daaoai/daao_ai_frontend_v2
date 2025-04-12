import { Hex } from 'viem';
import { SupportedDexType, Token } from './chains';

export type DaoInfo = {
  fundraisingGoal: bigint;
  totalRaised: bigint;
  goalReached: boolean;
  fundraisingFinalized: boolean;
  fundraisingDeadline: number;
  daoToken: Hex;
  paymentToken: Hex;
  daoTokenDetails: Token;
  paymentTokenDetails: Token;
  isPaymentTokenNative: boolean;
  owner: Hex;
};

export type FundDetails = {
  id: string;
  address: Hex;
  title: string;
  token: Hex;
  status: 'live' | 'funding' | 'trading' | 'soon';
  description: string;
  imgSrc: string;
  dexInfo: {
    type: SupportedDexType;
    fee: number;
    tickSpacing: number;
  };
  isManageLiquidityEnabled?: boolean;
  isLpFarmsEnabled?: boolean;
};
