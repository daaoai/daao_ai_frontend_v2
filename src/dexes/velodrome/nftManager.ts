import { AddLiquidityParams } from '@/types/addLiquidity';
import {
  GetNFTDetailsRequest,
  GetUserNFTIdsRequest,
  GetUserNFTsForPoolRequest,
  INFTManager,
  V3Position,
} from '@/types/dex';
import { multicallForSameContract } from '@/utils/multicall';
import { getPublicClient } from '@/utils/publicClient';
import { encodeFunctionData, Hex } from 'viem';
import { velodromeNFTManagerAbi } from './abi/nftManager';

export class VelodromeNFTManager implements INFTManager {
  generateMintCallData = ({
    token0,
    token1,
    tickSpacing,
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    recipient,
    deadline,
  }: AddLiquidityParams) => {
    return encodeFunctionData({
      abi: velodromeNFTManagerAbi,
      functionName: 'mint',
      args: [
        {
          amount0Desired,
          amount0Min,
          amount1Desired,
          amount1Min,
          deadline,
          recipient,
          sqrtPriceX96: 0n, // velodrome accepts 0n as sqrtPriceX96
          tickLower,
          tickSpacing,
          tickUpper,
          token0,
          token1,
        },
      ],
    });
  };

  getUserNFTIds = async ({ account, chainId, poolAddress, nftManagerAddress }: GetUserNFTIdsRequest) => {
    const publicClient = getPublicClient(chainId);
    const nftIds = await publicClient.readContract({
      address: nftManagerAddress,
      abi: velodromeNFTManagerAbi,
      functionName: 'userPositions',
      args: [account, poolAddress],
    });

    return nftIds.map((nftId) => BigInt(nftId));
  };

  getUserNFTsForPool = async ({
    account,
    chainId,
    poolAddress,
    nftManagerAddress,
  }: GetUserNFTsForPoolRequest): Promise<V3Position[]> => {
    const nftIds = await this.getUserNFTIds({ account, chainId, poolAddress, nftManagerAddress });
    const userNfts = (await multicallForSameContract({
      abi: velodromeNFTManagerAbi,
      address: nftManagerAddress,
      chainId,
      functionNames: new Array(nftIds.length).fill('positions'),
      params: nftIds.map((nftId) => [nftId]),
    })) as [bigint, Hex, Hex, Hex, number, number, number, bigint, bigint, bigint, bigint, bigint][];

    const userNftsWithId = userNfts.map((nft, index) => ({
      id: nftIds[index],
      nonce: nft[0],
      operator: nft[1],
      token0: nft[2],
      token1: nft[3],
      tickSpacing: nft[4],
      fee: 0, // velodrome does not use fee in the same way as uniswap
      tickLower: nft[5],
      tickUpper: nft[6],
      liquidity: nft[7],
      feeGrowthInside0LastX128: nft[8],
      feeGrowthInside1LastX128: nft[9],
      tokensOwed0: nft[10],
      tokensOwed1: nft[11],
    }));

    return userNftsWithId;
  };

  getNFTDetails = async ({ nftId, nftManagerAddress, chainId }: GetNFTDetailsRequest): Promise<V3Position> => {
    const publicClient = getPublicClient(chainId);
    const res = await publicClient.readContract({
      address: nftManagerAddress,
      abi: velodromeNFTManagerAbi,
      functionName: 'positions',
      args: [nftId],
    });
    return {
      id: nftId,
      nonce: res[0],
      operator: res[1],
      token0: res[2],
      token1: res[3],
      fee: 0, // velodrome does not use fee in the same way as uniswap
      tickSpacing: res[4],
      tickLower: res[5],
      tickUpper: res[6],
      liquidity: res[7],
      feeGrowthInside0LastX128: res[8],
      feeGrowthInside1LastX128: res[9],
      tokensOwed0: res[10],
      tokensOwed1: res[11],
    };
  };
}
