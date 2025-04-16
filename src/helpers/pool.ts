import { supportedDexesTypes } from '@/constants/dex';
import { KodiakDex } from '@/dexes/kodiakDex';
import { PancakeDex } from '@/dexes/pancake';
import { UniswapV3Pool } from '@/dexes/uniswap/v3Pool';
import { UniswapCustomRouterDex } from '@/dexes/uniswapCustomRouter';
import { VelodromeV3Pool } from '@/dexes/velodrome/v3Pool';
import { VelodromeCustomRouterDex } from '@/dexes/velodromeCustomRouter';
import { SupportedDexType } from '@/types/chains';
import { Hex, zeroAddress } from 'viem';

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

export const getPoolSlot0 = async ({
  address,
  type,
  chainId,
}: {
  address: Hex;
  type: SupportedDexType;
  chainId: number;
}) => {
  const uniswapHandler = async () => {
    const uniswapPool = new UniswapV3Pool(chainId, address);
    return await uniswapPool.slot0();
  };
  const velodromeHandler = async () => {
    const velodromeDex = new VelodromeV3Pool(chainId, address);
    return await velodromeDex.slot0();
  };
  const handlers: {
    [key in SupportedDexType]: () => Promise<{ sqrtPriceX96: bigint; currentTick: number }>;
  } = {
    [supportedDexesTypes.uniswapCustomRouter]: uniswapHandler,
    [supportedDexesTypes.velodromeCustomRouter]: velodromeHandler,
    [supportedDexesTypes.pancake]: uniswapHandler,
    [supportedDexesTypes.kodiak]: uniswapHandler,
  };
  const handler = handlers[type];

  if (!handler) {
    return { sqrtPriceX96: BigInt(0), currentTick: 0 };
  }

  return await handler();
};
