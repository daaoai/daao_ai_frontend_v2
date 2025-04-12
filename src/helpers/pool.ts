import { supportedDexesTypes } from '@/constants/dex';
import { VelodromeCustomRouterDex } from '@/dexes/velodromeCustomRouter';
import { PancakeDex } from '@/dexes/pancake';
import { UniswapCustomRouterDex } from '@/dexes/UniswapCustomRouter';
import { SupportedDexType } from '@/types/chains';
import { Hex, zeroAddress } from 'viem';
import { KodiakDex } from '@/dexes/kodiakDex';

export const getPoolAddress = async ({
  token0,
  token1,
  tickSpacing,
  factoryAddress,
  fee,
  type,
  chainId,
}: {
  token0: Hex;
  token1: Hex;
  tickSpacing: number;
  fee: number;
  factoryAddress: Hex;
  type: SupportedDexType;
  chainId: number;
}) => {
  const handlers: {
    [key in SupportedDexType]?: (args: {
      token0: Hex;
      token1: Hex;
      tickSpacing: number;
      fee: number;
      chainId: number;
      factoryAddress: Hex;
    }) => Promise<Hex>;
  } = {
    [supportedDexesTypes.uniswapCustomRouter]: async (args) => {
      const uniswapDex = new UniswapCustomRouterDex(args.chainId);
      return await uniswapDex.getPoolAddress(args);
    },
    [supportedDexesTypes.velodromeCustomRouter]: async (args) => {
      const velodromeDex = new VelodromeCustomRouterDex(args.chainId);
      return await velodromeDex.getPoolAddress(args);
    },
    [supportedDexesTypes.pancake]: async (args) => {
      const pancakeDex = new PancakeDex(args.chainId);
      return await pancakeDex.getPoolAddress(args);
    },
    [supportedDexesTypes.kodiak]: async (args) => {
      const kodiakDex = new KodiakDex(args.chainId);
      return await kodiakDex.getPoolAddress(args);
    },
  };
  const handler = handlers[type];

  if (!handler) {
    return zeroAddress;
  }

  return await handler({
    token0,
    token1,
    tickSpacing,
    fee,
    chainId,
    factoryAddress,
  });
};

export const getPoolDetails = async ({
  address,
  type,
  chainId,
}: {
  address: Hex;
  type: SupportedDexType;
  chainId: number;
}) => {
  const handlers: {
    [key in SupportedDexType]?: (args: { address: Hex; chainId: number }) => Promise<{ token0: Hex; token1: Hex }>;
  } = {
    [supportedDexesTypes.uniswapCustomRouter]: async (args) => {
      const uniswapDex = new UniswapCustomRouterDex(args.chainId);
      return await uniswapDex.getPoolDetails(args.address);
    },
    [supportedDexesTypes.velodromeCustomRouter]: async (args) => {
      const velodromeDex = new VelodromeCustomRouterDex(args.chainId);
      return await velodromeDex.getPoolDetails(args.address);
    },
    [supportedDexesTypes.pancake]: async (args) => {
      const pancakeDex = new PancakeDex(args.chainId);
      return await pancakeDex.getPoolDetails(args.address);
    },
    [supportedDexesTypes.kodiak]: async (args) => {
      const kodiakDex = new KodiakDex(args.chainId);
      return await kodiakDex.getPoolDetails(args.address);
    },
  };
  const handler = handlers[type];

  if (!handler) {
    return { token0: zeroAddress, token1: zeroAddress };
  }

  return await handler({
    address,
    chainId,
  });
};
