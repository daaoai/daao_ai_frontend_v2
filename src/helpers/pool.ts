import { supportedDexesTypes } from '@/constants/dex';
import { KodiakDex } from '@/dexes/kodiakDex';
import { PancakeDex } from '@/dexes/pancake';
import { UniswapV3Pool } from '@/dexes/uniswap/v3Pool';
import { UniswapCustomRouterDex } from '@/dexes/UniswapCustomRouter';
import { VelodromeV3Pool } from '@/dexes/velodrome/v3Pool';
import { VelodromeCustomRouterDex } from '@/dexes/velodromeCustomRouter';
import { fetchTokenPriceDexScreener } from '@/hooks/token/useTokenPrice';
import { SupportedDexType } from '@/types/chains';
import { V3PoolDetailedDetails } from '@/types/pool';
import { getTokenDetails } from '@/utils/token';
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
      return await uniswapDex.getV3PoolDetails(args.address);
    },
    [supportedDexesTypes.velodromeCustomRouter]: async (args) => {
      const velodromeDex = new VelodromeCustomRouterDex(args.chainId);
      return await velodromeDex.getV3PoolDetails(args.address);
    },
    [supportedDexesTypes.pancake]: async (args) => {
      const pancakeDex = new PancakeDex(args.chainId);
      return await pancakeDex.getV3PoolDetails(args.address);
    },
    [supportedDexesTypes.kodiak]: async (args) => {
      const kodiakDex = new KodiakDex(args.chainId);
      return await kodiakDex.getV3PoolDetails(args.address);
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

export const getV3DetailedPoolDetails = async ({
  address,
  type,
  chainId,
}: {
  address: Hex;
  type: SupportedDexType;
  chainId: number;
}): Promise<V3PoolDetailedDetails> => {
  const handlers = {
    [supportedDexesTypes.uniswapCustomRouter]: async () => {
      const uniswapPool = new UniswapV3Pool(chainId, address);
      return await uniswapPool.getV3PoolDetails();
    },
    [supportedDexesTypes.velodromeCustomRouter]: async () => {
      const velodromePool = new VelodromeV3Pool(chainId, address);
      return await velodromePool.getV3PoolDetails();
    },
    [supportedDexesTypes.pancake]: async () => {
      const pancakePool = new UniswapV3Pool(chainId, address);
      return await pancakePool.getV3PoolDetails();
    },
    [supportedDexesTypes.kodiak]: async () => {
      const kodiakPool = new UniswapV3Pool(chainId, address);
      return await kodiakPool.getV3PoolDetails();
    },
  };
  const handler = handlers[type];

  if (!handler) {
    throw new Error(`No handler found for type: ${type}`);
  }

  const res = await handler();

  const token0 = res.token0;
  const token1 = res.token1;

  const [token0Details, token1Details, token0Price, token1Price] = await Promise.all([
    getTokenDetails({ address: token0, chainId }),
    getTokenDetails({ address: token1, chainId }),
    fetchTokenPriceDexScreener({ address: token0, chainId }),
    fetchTokenPriceDexScreener({ address: token1, chainId }),
  ]);

  return {
    ...res,
    token0Details: {
      ...token0Details,
      price: token0Price,
    },
    token1Details: {
      ...token1Details,
      price: token1Price,
    },
  };
};
