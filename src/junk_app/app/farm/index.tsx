'use client';
import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import usePoolList from '@/hooks/farm/usePoolList';
import { FarmPool } from '@/types/farm';
import FarmCardSkeleton from '@/components/skeleton/farmCard';
import FarmCard from '@/components/dashboard/farmCard';
const Farms: React.FC = () => {
  const { getPoolList } = usePoolList();
  const [isPoolListLoading, setIsPoolListLoading] = useState(true);
  const [farmPools, setFarmPools] = useState<FarmPool[]>([]);
  useEffect(() => {
    console.log('running');
    const fetchPoolAddresses = async () => {
      try {
        setIsPoolListLoading(true);
        const responsePoolList = await getPoolList();
        setFarmPools(responsePoolList);
        console.log('ResponsePoolList:', responsePoolList);
        setIsPoolListLoading(false);
      } catch (error) {
        console.error('Error fetching pool addresses:', error);
        setIsPoolListLoading(false);
      }
    };
    fetchPoolAddresses();
  }, []);
  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`w-screen overflow-hidden gap-20 flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-left">Farming Pools</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
            {isPoolListLoading ? (
              <FarmCardSkeleton />
            ) : (
              farmPools.map((farm, index) => <FarmCard key={`${farm.poolAddress}-${index}`} farm={farm} />)
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farms;
