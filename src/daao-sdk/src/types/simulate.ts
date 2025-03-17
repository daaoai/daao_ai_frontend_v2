import { BigNumber } from 'ethers';
import { Abi, Hex } from 'viem';

export type SimulateCallParams = {
  address: Hex;
  abi: Abi;
  functionName: string;
  args: (number | string | bigint | boolean | Hex | BigNumber)[];
  account?: Hex;
};

export type SimulateResult<T = unknown> = {
  success: boolean;
  result?: T;
  error?: string;
};
