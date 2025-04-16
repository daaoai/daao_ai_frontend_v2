import { getDexAddressesForChain } from '@/constants/dex';
import { fetchDaoInfo } from '@/helpers/contribution';
import { getPoolAddress, getPoolDetails } from '@/helpers/pool';
import { DaoInfo, FundDetails } from '@/types/daao';
import { PoolDetails } from '@/types/pool';
import { throttle } from 'lodash';
import { useState } from 'react';
import { toast } from 'sonner';

export const useDaaoInfo = ({ chainId, fundDetails }: { chainId: number; fundDetails: FundDetails }) => {
  // states
  const [isLoading, setIsLoading] = useState(false);
  const [daoInfo, setDaoInfo] = useState<DaoInfo | null>(null);
  const [poolDetails, setPoolDetails] = useState<PoolDetails | null>(null);

  const dexDetails = getDexAddressesForChain(chainId, fundDetails.dexInfo.type);

  // functions

  const getDaaoInfo = async () => {
    try {
      setIsLoading(true);
      const daoDetails = await fetchDaoInfo({
        chainId,
        daoAddress: fundDetails.address,
        useWnativeToken: true,
      });
      if (daoDetails) {
        await fetchPoolDetails(daoDetails);
        setDaoInfo({
          ...daoDetails,
        });
      }
    } catch (error) {
      console.error('Error fetching DAO info and pool address:', error);
      toast.error('Error fetching DAO info and pool address');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPoolDetails = async (daaoInfo: DaoInfo) => {
    try {
      const poolAddress = await getPoolAddress({
        chainId,
        fee: fundDetails.dexInfo.fee,
        token0: daaoInfo.paymentToken,
        token1: daaoInfo.daoToken,
        tickSpacing: fundDetails.dexInfo.tickSpacing,
        type: fundDetails.dexInfo.type,
        factoryAddress: dexDetails.factoryAddress,
      });
      const poolDetails = await getPoolDetails({
        type: fundDetails.dexInfo.type,
        address: poolAddress,
        chainId,
      });
      setPoolDetails({
        address: poolAddress,
        ...poolDetails,
        tickSpacing: fundDetails.dexInfo.tickSpacing,
      });
    } catch (error) {
      console.error('Error fetching DAO info and pool address:', error);
      toast.error('Error fetching DAO info and pool address');
      return null;
    }
  };

  return {
    daoInfo,
    isLoading,
    poolDetails,
    getDaaoInfo,
    setIsLoading,
    setDaoInfo,
  };
};
