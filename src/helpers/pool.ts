import { chainsData } from '@/config/chains';
import { supportedDexesTypes } from '@/constants/dex';
import { UNI_FACTORY_ABI } from '@/daao-sdk/abi/uniFactory';
import { UNI_POOL_ABI } from '@/daao-sdk/abi/uniPool';
import { VELO_FACTORY_ABI } from '@/daao-sdk/abi/veloFactory';
import { SupportedDexType } from '@/types/chains';
import { multicallForSameContract } from '@/utils/multicall';
import { getPublicClient } from '@/utils/publicClient';
import { Hex } from 'viem';

export const findPoolDetails = async ({ address, chainId }: { address: Hex; chainId: number }) => {
  const multicallRes = (await multicallForSameContract({
    abi: UNI_POOL_ABI,
    address,
    chainId,
    functionNames: ['token0', 'token1'],
    params: [[], []],
  })) as [Hex, Hex];

  return {
    token0: multicallRes[0],
    token1: multicallRes[1],
  };
};

export const findPoolAddress = async ({
  token0,
  token1,
  tickSpacing,
  fee,
  type,
  chainId,
}: {
  token0: Hex;
  token1: Hex;
  tickSpacing: number;
  fee: number;
  type: SupportedDexType;
  chainId: number;
}) => {
  const handlers: {
    [key in SupportedDexType]: (args: {
      token0: Hex;
      token1: Hex;
      tickSpacing: number;
      fee: number;
      chainId: number;
      factoryAddress: Hex;
    }) => Promise<Hex>;
  } = {
    [supportedDexesTypes.pancake]: getPoolAddressFromUniswap,
    [supportedDexesTypes.uniswap]: getPoolAddressFromUniswap,
    [supportedDexesTypes.velodrome]: getPoolAddressFromVelodrome,
  };

  const handler = handlers[type];
  if (!handler) {
    throw new Error(`Unsupported dex type: ${type}`);
  }

  const factoryAddress = chainsData[chainId].dexInfo.factoryAddress;
  return await handler({
    token0,
    token1,
    tickSpacing,
    fee,
    chainId,
    factoryAddress,
  });
};

const getPoolAddressFromVelodrome = async ({
  token0,
  token1,
  tickSpacing,
  chainId,
  factoryAddress,
}: {
  token0: Hex;
  token1: Hex;
  fee: number;
  tickSpacing: number;
  chainId: number;
  factoryAddress: Hex;
}) => {
  const publicClient = getPublicClient(chainId);
  return await publicClient.readContract({
    abi: VELO_FACTORY_ABI,
    functionName: 'getPool',
    args: [token0, token1, tickSpacing],
    address: factoryAddress,
  });
};

const getPoolAddressFromUniswap = async ({
  token0,
  token1,
  fee,
  chainId,
  factoryAddress,
}: {
  token0: Hex;
  token1: Hex;
  tickSpacing: number;
  fee: number;
  chainId: number;
  factoryAddress: Hex;
}) => {
  const publicClient = getPublicClient(chainId);
  return await publicClient.readContract({
    abi: UNI_FACTORY_ABI,
    functionName: 'getPool',
    args: [token0, token1, fee],
    address: factoryAddress,
  });
};
