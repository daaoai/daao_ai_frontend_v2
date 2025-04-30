import { supportedDexesTypes } from '@/constants/dex';
import { KodiakDex } from '@/dexes/kodiakDex';
import { PancakeDex } from '@/dexes/pancake';
import { UniswapCustomRouterDex } from '@/dexes/uniswapCustomRouter';
import { VelodromeCustomRouterDex } from '@/dexes/velodromeCustomRouter';
import { SupportedDexType } from '@/types/chains';
import { Hex } from 'viem';

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
    [supportedDexesTypes.uniswapCustomRouter]: async () => {
      const uniswapDex = new UniswapCustomRouterDex(data.chainId);
      return await uniswapDex.fetchQuotes(data);
    },
    [supportedDexesTypes.velodromeCustomRouter]: async () => {
      const velodromeDex = new VelodromeCustomRouterDex(data.chainId);
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
    [supportedDexesTypes.uniswapCustomRouter]: async () => {
      const uniswapDex = new UniswapCustomRouterDex(data.chainId);
      return uniswapDex.generateSwapData(data);
    },
    [supportedDexesTypes.velodromeCustomRouter]: async () => {
      const velodromeDex = new VelodromeCustomRouterDex(data.chainId);
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
