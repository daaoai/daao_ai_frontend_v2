import { getDexAddressesForChain, supportedDexesTypes } from '@/constants/dex';
import { ROUTER_ABI } from '@/daao-sdk/abi/router';
import { SWAP_QUOTER_SIMULATE } from '@/daao-sdk/abi/swapQuoterAbi';
import { UNI_FACTORY_ABI } from '@/daao-sdk/abi/uniFactory';
import { UNI_POOL_ABI } from '@/daao-sdk/abi/uniPool';
import { SupportedDexType } from '@/types/chains';
import { DexProtocol, PoolAddressRequest } from '@/types/dex';
import { multicallForSameContract } from '@/utils/multicall';
import { getPublicClient } from '@/utils/publicClient';
import { encodeFunctionData, Hex, PublicClient } from 'viem';

export class UniswapCustomRouterDex implements DexProtocol {
  factoryAddress: Hex;
  swapRouterAddress: Hex;
  quoterAddress: Hex;
  publicClient: PublicClient;
  chainId: number;

  constructor(chainId: number, type: SupportedDexType = supportedDexesTypes.uniswapCustomRouter) {
    this.chainId = chainId;
    const dexDetails = getDexAddressesForChain(chainId, type);
    this.factoryAddress = dexDetails.factoryAddress;
    this.swapRouterAddress = dexDetails.swapRouterAddress;
    this.quoterAddress = dexDetails.quoterAddress;
    this.publicClient = getPublicClient(chainId);
  }

  getPoolAddress = async ({ token0, token1, fee }: PoolAddressRequest) => {
    return await this.publicClient.readContract({
      abi: UNI_FACTORY_ABI,
      functionName: 'getPool',
      args: [token0, token1, fee],
      address: this.factoryAddress,
    });
  };

  getPoolDetails = async (address: Hex) => {
    const multicallRes = (await multicallForSameContract({
      abi: UNI_POOL_ABI,
      address,
      chainId: this.chainId,
      functionNames: ['token0', 'token1'],
      params: [[], []],
    })) as [Hex, Hex];

    return {
      token0: multicallRes[0],
      token1: multicallRes[1],
    };
  };

  fetchQuotes = async ({
    poolAddress,
    amount,
    sqrtPrice,
    zeroToOne,
  }: {
    poolAddress: Hex;
    amount: bigint;
    sqrtPrice: bigint;
    zeroToOne: boolean;
  }) => {
    return (
      await this.publicClient.simulateContract({
        address: this.quoterAddress,
        abi: SWAP_QUOTER_SIMULATE,
        functionName: 'quoteExactInputSingle',
        args: [poolAddress, zeroToOne, amount, sqrtPrice],
      })
    ).result;
  };

  generateSwapData = ({
    poolAddress,
    zeroToOne,
    amount,
    minAmount,
    deadline,
    sqrtPrice,
  }: {
    poolAddress: Hex;
    zeroToOne: boolean;
    amount: bigint;
    minAmount: bigint;
    deadline: bigint;
    sqrtPrice: bigint;
  }) => {
    const args = [
      poolAddress,
      zeroToOne,
      amount,
      sqrtPrice,
      minAmount,
      deadline,
    ] as const;

    const callData = encodeFunctionData({
      abi: ROUTER_ABI,
      args,
      functionName: 'getSwapResult',
    });

    return {
      callData,
      to: this.swapRouterAddress,
      value: 0n,
    };
  };
}
