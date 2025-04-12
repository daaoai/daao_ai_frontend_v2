import { fetchDaoInfo } from '@/helpers/contribution';
import { DaoInfo, FundDetails } from '@/types/daao';
import { throttle } from 'lodash';
import { useState } from 'react';
import { toast } from 'sonner';

export const useDaaoInfo = ({ chainId, fundDetails }: { chainId: number; fundDetails: FundDetails }) => {
  // states
  const [isLoading, setIsLoading] = useState(false);
  const [daoInfo, setDaoInfo] = useState<DaoInfo | null>(null);

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
        setDaoInfo(daoDetails);
      }
    } catch (error) {
      console.error('Error fetching DAO info and pool address:', error);
      toast.error('Error fetching DAO info and pool address');
    } finally {
      setIsLoading(false);
    }
  };

  const throttledGetDaaoInfo = throttle(getDaaoInfo, 1000);

  return {
    daoInfo,
    isLoading,
    getDaaoInfo,
    setIsLoading,
    setDaoInfo,
  };
};
