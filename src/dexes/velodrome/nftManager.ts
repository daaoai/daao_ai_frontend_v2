import { getDexAddressesForChain, supportedDexesTypes } from '@/constants/dex';
import { AddLiquidityParams } from '@/types/addLiquidity';
import { getPublicClient } from '@/utils/publicClient';
import { encodeFunctionData, Hex } from 'viem';
import { velodromeNFTManagerAbi } from './abi/nftManager';

export class VelodromeNFTManager {
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

  getUserNFTIds = async ({ account, chainId, poolAddress }: { account: Hex; chainId: number; poolAddress: Hex }) => {
    const nftManagerAddress = getDexAddressesForChain(chainId, supportedDexesTypes.velodromeCustomRouter).nftManager;
    const publicClient = getPublicClient(chainId);
    return await publicClient.readContract({
      address: nftManagerAddress,
      abi: velodromeNFTManagerAbi,
      functionName: 'userPositions',
      args: [account, poolAddress],
    });
  };
}
