import { Hex } from 'viem';
import { Token } from './chains';

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
};

export type FundDetails = {
  id: string;
  address: Hex;
  title: string;
  token: Hex;
  status: 'live' | 'funding' | 'trading' | 'soon';
  imgSrc: string;
};
