import { nonFungiblePositionManagerAddress } from '@/constants/addresses';
import { NON_FUNGIBLE_POSITION_MANAGER_ABI } from '@/daao-sdk/abi/nonFungiblePositionManager';
import { VELO_POOL_ABI } from '@/daao-sdk/abi/veloPool';
import { Position } from '@/types/farm';
import { CLPoolUtils } from '@/utils/v3Pools';
import { usePublicClient } from 'wagmi';
import { useAccount } from 'wagmi';
import useTokenPrice from '../useTokenPrice';
import { formatUnits } from 'viem';

const POOL_ADDRESS = '0x7303dbc086a18459A4dc74e74f2Dcc2a2a26131B';

const useLpFarms = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { fetchTokenPrice, fetchTokenPriceGeko } = useTokenPrice();

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

      return { ...positionDetails, liquidityUsd };
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

  return { getPositionList, getPositionDetails };
};

export default useLpFarms;
