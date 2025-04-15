export type TokenBalance = {
  address: string;
  chainId: number;
  balance: string;
  symbol: string;
  decimals: number;
  name: string;
  logo: string;
  price: number;
  balanceInUsd: number;
};

export type ApiTokenBalance = {
  contract: string;
  chainId: number;
  balance: string;
  symbol: string;
  decimals: number;
  name: string;
  logo: string;
  price: number;
  balanceInUsd: number;
};

export type ApiBalancesResponse = {
  [contractAddress: string]: ApiTokenBalance;
};
