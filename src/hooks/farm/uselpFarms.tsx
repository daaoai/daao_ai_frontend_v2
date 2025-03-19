import { lpFarmAddress, nonFungiblePositionManagerAddress } from '@/constants/addresses';
import { NON_FUNGIBLE_POSITION_MANAGER_ABI } from '@/daao-sdk/abi/nonFungiblePositionManager';
import { VELO_POOL_ABI } from '@/daao-sdk/abi/veloPool';
import { Position } from '@/types/farm';
import { CLPoolUtils } from '@/utils/v3Pools';
import { usePublicClient, useWriteContract } from 'wagmi';
import { useAccount } from 'wagmi';
import useTokenPrice from '../useTokenPrice';
import { formatUnits, type Abi, type TransactionReceipt } from 'viem';
import { LP_FARM_ABI } from '@/daao-sdk/abi/lpFarm';
import {
  LP_FARM_END_TIME,
  LP_FARM_POOL,
  LP_FARM_REFUNDEE,
  LP_FARM_REWARD_TOKEN,
  LP_FARM_START_TIME,
} from '@/constants/lpFarm';
import { useToast } from '../use-toast';
import { handleViemTransactionError } from '@/utils/approval';

const POOL_ADDRESS = '0xf70e76cc5a39aad1953bef3d1647c8b36f3f6324';

const useLpFarms = () => {
  const { toast } = useToast();

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { fetchTokenPrice } = useTokenPrice();
  const { writeContractAsync } = useWriteContract();

  const KEY_STRUCT = [LP_FARM_REWARD_TOKEN, LP_FARM_POOL, LP_FARM_START_TIME, LP_FARM_END_TIME, LP_FARM_REFUNDEE];

  const getPositionsIds = async () => {
    try {
      const response = await publicClient?.readContract({
        address: nonFungiblePositionManagerAddress,
        abi: NON_FUNGIBLE_POSITION_MANAGER_ABI,
        functionName: 'userPositions',
        args: [address, POOL_ADDRESS],
      });
      return response as bigint[];
    } catch (error) {
      console.error(error);
      return [] as bigint[];
    }
  };

  const getPositionDetails = async (positionId: bigint) => {
    try {
      const positionDetails = (await publicClient?.readContract({
        address: nonFungiblePositionManagerAddress,
        abi: NON_FUNGIBLE_POSITION_MANAGER_ABI,
        functionName: 'positions',
        args: [positionId],
      })) as Position;

      const poolDetails = (await publicClient?.readContract({
        address: '0xF70e76cC5a39Aad1953BeF3D1647C8B36f3f6324',
        abi: VELO_POOL_ABI,
        functionName: 'slot0',
      })) as [bigint, number, number, number, number, boolean];

      console.log(positionDetails, 'positionDetailspositionDetails');

      const amounts = CLPoolUtils.getTokenAmountsForLiquidity({
        liquidity: positionDetails.liquidity.toString(),
        sqrtPriceX96: poolDetails[0].toString(),
        lowerTick: positionDetails.tickLower,
        upperTick: positionDetails.tickUpper,
      });

      const tokenPricePromises = [fetchTokenPrice(positionDetails.token0), fetchTokenPrice(positionDetails.token1)];
      const [token0Price, token1Price] = await Promise.all(tokenPricePromises);

      const token0Amount = Number(formatUnits(BigInt(amounts.amount0InWei), 18)) * token0Price;
      const token1Amount = Number(formatUnits(BigInt(amounts.amount1InWei), 18)) * token1Price;

      const liquidityUsd = (token0Amount + token1Amount).toFixed(4);

      return { ...positionDetails, liquidityUsd, id: Number(positionId), apr: 0 };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getPositionList = async () => {
    try {
      const positionIdList = await getPositionsIds();
      const positionList = await Promise.all(positionIdList.map((positionId) => getPositionDetails(positionId)));
      return positionList as Position[];
    } catch (error) {
      console.error(error);
      return [] as Position[];
    }
  };

  const stakeFarm = async (tokenId: BigInt) => {
    try {
      const tx = await writeContractAsync({
        address: lpFarmAddress,
        abi: LP_FARM_ABI,
        functionName: 'stakeToken',
        args: [...KEY_STRUCT, tokenId],
      });
      const receipt = (await publicClient?.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      })) as TransactionReceipt;

      if (receipt.status === 'success') {
        toast({
          title: 'Stake Successful',
          description: `Your Stake was Successfull`,
          variant: 'default',
        });
      }
    } catch (error) {
      console.error(error);
      const { errorMsg } = handleViemTransactionError({
        abi: LP_FARM_ABI as Abi,
        error,
      });
      toast({
        title: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const unStakeFarm = async (tokenId: BigInt) => {
    try {
      const tx = await writeContractAsync({
        address: lpFarmAddress,
        abi: LP_FARM_ABI,
        functionName: 'unstakeToken',
        args: [...KEY_STRUCT, tokenId],
      });
      const receipt = (await publicClient?.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      })) as TransactionReceipt;
      if (receipt.status === 'success') {
        toast({
          title: 'Unstake Successful',
          description: `Your Unstake was Successfull`,
          variant: 'default',
        });
      }
      return receipt;
    } catch (error) {
      console.error(error);
      const { errorMsg } = handleViemTransactionError({
        abi: LP_FARM_ABI as Abi,
        error,
      });
      toast({
        title: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const rewardInfo = async (tokenId: BigInt) => {
    try {
      const rewardDetails = (await publicClient?.readContract({
        address: lpFarmAddress,
        abi: LP_FARM_ABI,
        functionName: 'getRewardInfo',
        args: [...KEY_STRUCT, tokenId],
      })) as [BigInt, BigInt];

      return { reward: rewardDetails[0], secondsInsideX128: rewardDetails[1] };
    } catch (error) {
      console.error(error);
      const { errorMsg } = handleViemTransactionError({
        abi: LP_FARM_ABI as Abi,
        error,
      });
      toast({
        title: errorMsg,
        variant: 'destructive',
      });
    }
  };

  return { getPositionList, getPositionDetails, stakeFarm, unStakeFarm, rewardInfo };
};

export default useLpFarms;
