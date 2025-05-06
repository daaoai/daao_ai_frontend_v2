import { getDexAddressesForChain } from '@/constants/dex';
import { lpFarmAddressesByChainId } from '@/constants/farm';
import { V3_STAKER_ABI } from '@/daao-sdk/abi/v3Staker';
import { uniswapV3NFTManagerAbi } from '@/dexes/uniswap/abi/nftManager';
import { encodeSingleIncentive } from '@/utils/lpFarm';
import { getNFTDetails, getUserNFTsForPool } from '@/helpers/nftManager';
import { getV3DetailedPoolDetails } from '@/helpers/pool';
import { Token } from '@/types/chains';
import { V3Position } from '@/types/dex';
import { Position } from '@/types/farm';
import { V3PoolDetailedDetails } from '@/types/pool';
import { multicallForSameContract } from '@/utils/multicall';
import { getPublicClient } from '@/utils/publicClient';
import { getTokenDetails } from '@/utils/token';
import { V3PoolUtils } from '@/utils/v3Pools';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatUnits } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

const useLpFarms = ({ chainId, lpFarmAddress }: { chainId: number; lpFarmAddress: string }) => {
  const { address } = useAccount();
  const publicClient = getPublicClient(chainId);

  const [poolDetails, setPoolDetails] = useState<V3PoolDetailedDetails | null>(null);
  const [rewardTokenDetails, setRewardTokenDetails] = useState<Token | null>(null);
  const { writeContractAsync } = useWriteContract();

  const { poolAddress, endTime, lpFarm, refundee, startTime, rewardToken, dexType } =
    lpFarmAddressesByChainId[chainId][lpFarmAddress];

  const nftManagerAddress = getDexAddressesForChain(chainId, dexType).nftManager;

  const updatePoolDetails = async () => {
    try {
      const res = await getV3DetailedPoolDetails({
        address: poolAddress,
        chainId,
        type: dexType,
      });
      setPoolDetails(res);
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const updateRewardTokenDetails = async () => {
    try {
      const tokenDetails = await getTokenDetails({
        address: rewardToken,
        chainId,
      });
      setRewardTokenDetails(tokenDetails);
      return tokenDetails;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const formatPositionDetails = (
    position: V3Position & { numberOfStakes: number; rewardInfo: bigint },
    poolDetails: V3PoolDetailedDetails,
  ): Position => {
    const { amount0, amount1 } = V3PoolUtils.getTokenAmountsForLiquidity({
      liquidity: position.liquidity,
      lowerTick: position.tickLower,
      upperTick: position.tickUpper,
      sqrtPriceX96: poolDetails.slot0.sqrtPriceX96,
    });

    const token0Price = poolDetails.token0Details.price;
    const token1Price = poolDetails.token1Details.price;
    const formattedAmount0 = Number(formatUnits(amount0, poolDetails.token0Details.decimals));
    const formattedAmount1 = Number(formatUnits(amount1, poolDetails.token1Details.decimals));
    const token0Amount = formattedAmount0 * token0Price;
    const token1Amount = formattedAmount1 * token1Price;
    const liquidityUsd = (token0Amount + token1Amount).toFixed(4);
    const apr = 0; // Placeholder for APR calculation
    const numberOfStakes = position.numberOfStakes;
    const id = Number(position.id);
    return {
      ...position,
      token0Details: poolDetails.token0Details,
      token1Details: poolDetails.token1Details,
      liquidityUsd,
      numberOfStakes,
      id,
      rewardInfo: position.rewardInfo,
      apr,
    };
  };

  const getNumberOfStakedForPositions = async (tokenIds: bigint[]) => {
    try {
      const staked = (await multicallForSameContract({
        abi: V3_STAKER_ABI,
        address: lpFarm,
        chainId,
        functionNames: new Array(tokenIds.length).fill('deposits'),
        params: tokenIds.map((tokenId) => [tokenId]),
      })) as [`0x${string}`, number, number, number][];
      return staked.reduce(
        (acc, val, index) => {
          const tokenId = tokenIds[index];
          acc[tokenId.toString()] = val[1];
          return acc;
        },
        {} as { [key: string]: number },
      );
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  const getPoolDetails = async () => {
    let poolInfo = poolDetails;
    if (!poolInfo) {
      poolInfo = await updatePoolDetails();
    }
    return poolInfo;
  };

  const getUserPositionsForPool = async () => {
    const poolDetails = await getPoolDetails();
    if (!poolDetails) {
      return [];
    }
    if (!address) {
      return [];
    }
    const userPositions = await getUserNFTsForPool({
      account: address,
      chainId,
      poolAddress: poolAddress,
      fee: poolDetails.fee,
      token0: poolDetails.token0,
      token1: poolDetails.token1,
      nftManagerAddress,
      type: dexType,
    });

    return userPositions.map((position) => {
      const formattedPosition = formatPositionDetails(
        {
          ...position,
          numberOfStakes: 0,
          rewardInfo: 0n,
        },
        poolDetails,
      );
      return formattedPosition;
    });
  };

  const stakeFarm = async (tokenId: bigint) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      const encodedData = encodeSingleIncentive({
        rewardToken,
        pool: poolAddress,
        startTime,
        endTime,
        refundee,
      });
      const tx = await writeContractAsync({
        address: nftManagerAddress,
        abi: uniswapV3NFTManagerAbi,
        functionName: 'safeTransferFrom',
        args: [address, lpFarm, tokenId, encodedData],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      if (receipt.status === 'success') {
        toast.success('Your Stake was Successfull');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to stake');
    }
  };

  const unStakeFarm = async (tokenId: bigint) => {
    try {
      const tx = await writeContractAsync({
        address: lpFarm,
        abi: V3_STAKER_ABI,
        functionName: 'unstakeToken',
        args: [
          {
            endTime,
            pool: poolAddress,
            refundee,
            rewardToken,
            startTime,
          },
          tokenId,
        ],
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      if (receipt.status === 'success') {
        toast.success('Your Unstake was Successful');
      }
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error('Failed to unstake');
    }
  };

  const getStakedPositionsIds = async () => {
    if (!address) {
      return [];
    }
    try {
      const stakedPositions = await publicClient.readContract({
        address: lpFarm,
        abi: V3_STAKER_ABI,
        functionName: 'getUserStakedTokens',
        args: [address],
      });
      return stakedPositions.map((positionId: bigint) => BigInt(positionId));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getStakedPositionList = async (): Promise<Position[]> => {
    try {
      const poolDetails = await getPoolDetails();
      if (!poolDetails) {
        return [];
      }
      const stakedPositionsIds = await getStakedPositionsIds();

      const [rewardInfo, numberOfStaked, positionResults] = await Promise.all([
        getRewardInfo(stakedPositionsIds),
        getNumberOfStakedForPositions(stakedPositionsIds),
        Promise.all(
          stakedPositionsIds.map((positionId) =>
            getNFTDetails({
              chainId,
              nftId: positionId,
              nftManagerAddress: nftManagerAddress,
              type: dexType,
            }),
          ),
        ),
      ]);

      // Filter out rejected promises and map successful results to Position objects
      const stakedPositionList = positionResults.map((position) => {
        return formatPositionDetails(
          {
            ...position,
            numberOfStakes: numberOfStaked[position.id.toString()] || 0,
            rewardInfo: rewardInfo[position.id.toString()],
          },
          poolDetails,
        );
      });

      return stakedPositionList;
    } catch (error) {
      console.error('Error fetching staked positions:', error);
      return [];
    }
  };

  const getRewardInfo = async (tokenIds: bigint[]) => {
    try {
      const rewardDetails = await publicClient.multicall({
        contracts: tokenIds.map((tokenId) => ({
          address: lpFarm,
          abi: V3_STAKER_ABI,
          functionName: 'getRewardInfo',
          args: [[rewardToken, poolAddress, startTime, endTime, refundee], tokenId],
        })),
      });

      const rewardInfo = rewardDetails?.reduce((acc: { [key: string]: bigint }, item: any, index: number) => {
        const firstValue = item?.result?.[0] ?? BigInt(0);
        const tokenId = tokenIds[index];
        acc[tokenId.toString()] = firstValue;
        return acc;
      }, {});

      return rewardInfo || {};
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  const getClaimableRewards = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return BigInt(0);
    }
    try {
      const claimableRewards = await publicClient.readContract({
        address: lpFarm,
        abi: V3_STAKER_ABI,
        functionName: 'rewards',
        args: [rewardToken, address],
      });
      return claimableRewards;
    } catch (error) {
      console.error(error);
      return BigInt(0);
    }
  };

  const claimRewards = async (rewardTokenAmount: bigint) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      const tx = await writeContractAsync({
        address: lpFarm,
        abi: V3_STAKER_ABI,
        functionName: 'claimReward',
        args: [rewardToken, address, rewardTokenAmount],
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      if (receipt.status === 'success') {
        toast.success('Your Stake was Successful');
      }
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error('Failed to claim rewards');
    }
  };

  const withdrawPosition = async (tokenId: bigint) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    try {
      const encodedData = encodeSingleIncentive({
        rewardToken,
        pool: poolAddress,
        startTime,
        endTime,
        refundee,
      });
      const tx = await writeContractAsync({
        address: lpFarm,
        abi: V3_STAKER_ABI,
        functionName: 'withdrawToken',
        args: [tokenId, address, encodedData],
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      if (receipt.status === 'success') {
        toast.success('Your Withdraw was Successful');
      }
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error('Failed to withdraw position');
    }
  };

  useEffect(() => {
    updatePoolDetails();
    updateRewardTokenDetails();
  }, []);

  return {
    poolDetails,
    rewardTokenDetails,
    getUserPositionsForPool,
    stakeFarm,
    getClaimableRewards,
    unStakeFarm,
    claimRewards,
    getStakedPositionsIds,
    getStakedPositionList,
    withdrawPosition,
  };
};

export default useLpFarms;
