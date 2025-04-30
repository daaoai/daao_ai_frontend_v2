import { farmAddressesByChainId } from '@/constants/farm';
import { FARM_FACTORY_ABI } from '@/daao-sdk/abi/farmFactory';
import { POOL_ABI } from '@/daao-sdk/abi/pool';
import { FarmPool } from '@/types/farm';
import { multicallForSameContract } from '@/utils/multicall';
import { getPublicClient } from '@/utils/publicClient';
import { getTokenDetails } from '@/utils/token';
import { formatUnits, Hex } from 'viem';
import { useAccount } from 'wagmi';
import useTokenPrice from '../token/useTokenPrice';

const usePoolList = ({ chainId }: { chainId: number }) => {
  const { address } = useAccount();
  const publicClient = getPublicClient(chainId);

  const farmFactoryAddress = farmAddressesByChainId[chainId]?.factory;

  const { fetchTokenPriceDexScreener, fetchTokenPriceGecko } = useTokenPrice();
  const getTotalPoolLength = async () => {
    try {
      const response = await publicClient.readContract({
        address: farmFactoryAddress,
        abi: FARM_FACTORY_ABI,
        functionName: 'nitroPoolsLength',
      });
      return response;
    } catch (err) {
      console.log({ err });
      return 0;
    }
  };
  const getPoolAddresses = async () => {
    const totalLengthOfPool = await getTotalPoolLength();

    const length = Number(totalLengthOfPool) || 0;
    const multicallResponse = (await multicallForSameContract({
      abi: FARM_FACTORY_ABI,
      address: farmFactoryAddress,
      chainId,
      functionNames: new Array(length).fill('getNitroPool'),
      params: Array.from({ length }, (_, i) => [i]),
    })) as Hex[];
    return multicallResponse;
  };

  const getPoolDetails = async ({ poolAddress }: { poolAddress: Hex }) => {
    try {
      const poolDetailsFunctions = [
        'settings',
        'totalDepositAmount',
        'rewardsToken1',
        'rewardsToken1PerSecond',
        'depositToken',
      ];
      const userInfoFunctions = ['userInfo', 'pendingRewards'];

      const [poolDetails, userInfo] = await Promise.all([
        multicallForSameContract({
          abi: POOL_ABI,
          address: poolAddress,
          chainId,
          functionNames: poolDetailsFunctions,
          params: new Array(poolDetailsFunctions.length).fill([]),
        }) as Promise<[[bigint, bigint], bigint, [Hex, bigint, bigint, bigint], bigint, Hex]>,
        address
          ? (multicallForSameContract({
              abi: POOL_ABI,
              address: poolAddress,
              chainId,
              functionNames: userInfoFunctions,
              params: new Array(userInfoFunctions.length).fill([address]),
            }) as Promise<[[bigint, bigint], bigint]>)
          : Promise.resolve([[BigInt(0), BigInt(0)], BigInt(0)] as const),
      ]);

      const rewardTokenAddress = poolDetails[2][0];
      const depositTokenAddress = poolDetails[4];

      const [rewardTokenDetails, depositTokenDetails, rewardTokenPrice, depositTokenPrice] = await Promise.all([
        getTokenDetails({
          address: rewardTokenAddress,
          chainId,
        }),
        getTokenDetails({
          address: depositTokenAddress,
          chainId,
        }),
        fetchTokenPriceGecko({ address: rewardTokenAddress, chainId }),
        fetchTokenPriceDexScreener({ address: depositTokenAddress, chainId }),
      ]);

      const rewardsEmissionUSD = Number(formatUnits(poolDetails[3], rewardTokenDetails.decimals)) * rewardTokenPrice;
      const totalStakedUSD = Number(formatUnits(poolDetails[1], depositTokenDetails.decimals)) * depositTokenPrice;
      const apr =
        totalStakedUSD && rewardsEmissionUSD
          ? Math.abs(Number(((rewardsEmissionUSD * 365 * 24 * 3600) / totalStakedUSD) * 100) || 0)
          : 0;

      return {
        startTime: poolDetails[0][0] || BigInt(0),
        endTime: poolDetails[0][1] || BigInt(0),
        totalStakedAmount: poolDetails[1] || BigInt(0),
        totalStakedUSD,
        rewards: {
          tokenAddress: poolDetails[2][0],
          rewards: poolDetails[2][1] || BigInt(0),
          remainingRewards: poolDetails[2][2] || BigInt(0),
          accRewards: poolDetails[2][3] || BigInt(0),
        },
        rewardTokenPerSec: poolDetails[3] || BigInt(0),
        userInfo: {
          stakedAmount: userInfo[0][0] || BigInt(0),
          rewardDebt: userInfo[0][1] || BigInt(0),
        },
        unclaimedReward: userInfo[1] || BigInt(0),
        poolAddress,
        apr,
        depositTokenDetails,
        rewardTokenDetails,
      };
    } catch (err) {
      console.trace({ err });
      return null;
    }
  };

  const getPoolList = async () => {
    if (!farmFactoryAddress) return [];
    const poolAddresses = await getPoolAddresses();
    const poolDetailsPromise = poolAddresses?.map((poolAddress) => getPoolDetails({ poolAddress })) || [];
    const poolListData = await Promise.allSettled(poolDetailsPromise);
    const poolList: FarmPool[] = (
      poolListData.filter(
        (poolDetailsRes) => poolDetailsRes.status === 'fulfilled' && poolDetailsRes.value,
      ) as PromiseFulfilledResult<FarmPool>[]
    ).map((res) => res.value);
    return poolList;
  };
  return { getPoolAddresses, getPoolDetails, getPoolList };
};

export default usePoolList;
