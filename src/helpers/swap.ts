import { supportedDexesTypes } from '@/constants/dex';
import { KodiakDex } from '@/dexes/kodiakDex';
import { PancakeDex } from '@/dexes/pancake';
import { UniswapDex } from '@/dexes/uniswap';
import { VelodromeDex } from '@/dexes/velodrome';
import { SupportedDexType } from '@/types/chains';
import { Hex, zeroAddress } from 'viem';

export const getQuotes = async (data: {
  tokenIn: Hex;
  tokenOut: Hex;
  fee: number;
  poolAddress: Hex;
  amount: bigint;
  sqrtPrice: bigint;
  zeroToOne: boolean;
  type: SupportedDexType;
  chainId: number;
}) => {
  const handlers = {
    [supportedDexesTypes.uniswap]: async () => {
      const uniswapDex = new UniswapDex(data.chainId);
      return await uniswapDex.fetchQuotes(data);
    },
    [supportedDexesTypes.velodrome]: async () => {
      const velodromeDex = new VelodromeDex(data.chainId);
      return await velodromeDex.fetchQuotes(data);
    },
    [supportedDexesTypes.pancake]: async () => {
      const pancakeDex = new PancakeDex(data.chainId);
      return await pancakeDex.fetchQuotes(data);
    },
    [supportedDexesTypes.kodiak]: async () => {
      const kodiakDex = new KodiakDex(data.chainId);
      return await kodiakDex.fetchQuotes(data);
    },
  };
  const handler = handlers[data.type];

  if (!handler) {
    return 0n;
  }

  return await handler();
};

export const getSwapData = (data: {
  tokenIn: Hex;
  tokenOut: Hex;
  fee: number;
  recipient: Hex;
  poolAddress: Hex;
  amount: bigint;
  sqrtPrice: bigint;
  deadline: bigint;
  minAmount: bigint;
  zeroToOne: boolean;
  type: SupportedDexType;
  chainId: number;
}) => {
  const handlers = {
    [supportedDexesTypes.uniswap]: async () => {
      const uniswapDex = new UniswapDex(data.chainId);
      return uniswapDex.generateSwapData(data);
    },
    [supportedDexesTypes.velodrome]: async () => {
      const velodromeDex = new VelodromeDex(data.chainId);
      return velodromeDex.generateSwapData(data);
    },
    [supportedDexesTypes.pancake]: async () => {
      const pancakeDex = new PancakeDex(data.chainId);
      return pancakeDex.generateSwapData(data);
    },
    [supportedDexesTypes.kodiak]: async () => {
      const kodiakDex = new KodiakDex(data.chainId);
      return kodiakDex.generateSwapData(data);
    },
  };
  const handler = handlers[data.type];

  if (!handler) {
    throw new Error('Unsupported dex type');
  }

  return handler();
};
