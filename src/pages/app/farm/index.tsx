"use client"
import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/page-layout';
import { workSans } from '@/lib/fonts';
import FarmCard from '@/components/dashboard/farm-card';
import { TriangleAlert } from 'lucide-react';
import usePoolList from '@/hooks/farm/usePoolList';
import { FarmPool } from '@/types/farm';
const Farms: React.FC = () => {

  const {getPoolList} = usePoolList();
  const [farmPools, setFarmPools] = useState<FarmPool[]>([]);
  useEffect(() => {
    console.log("running")
    const fetchPoolAddresses = async () => {
      try {
        const responsePoolList = await getPoolList()
        setFarmPools(responsePoolList)
        console.log("ResponsePoolList:", responsePoolList);
      } catch (error) {
        console.error("Error fetching pool addresses:", error);
      }
    };
    fetchPoolAddresses();
  }, []);
  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`w-screen overflow-hidden gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-left">Farming Pools</h1>
          <div className='mb-8 text-left'>
            <div className="w-full px-4 py-6 bg-[#409cff]/20 rounded-lg border border-[#409cff] flex items-center gap-4">
              <TriangleAlert className="w-10 h-10 text-[#409cff] flex-shrink-0" />
              <div className="text-sm sm:text-base">
                <span className="text-white">
                  Stake your DAO tokens to earn Daos World Whitelist Tokens (DWL). Burn 1 DWL for a guaranteed whitelist spot on any Daos World project, or burn less for a weighted raffle entry.{' '}
                </span>
                <span className="text-[#409cff] font-medium">
                  DWL is a whitelist utility token with no inherent market value.
                </span>
                <span className="text-white">
                  It is not a governance or platform token. Do not trade or speculate on it.
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
          {farmPools.map((farm, index) => (
          <FarmCard key={`${farm.poolAddress}-${index}`} farm={farm} />
          ))}
          </div>
        </div>
      </div>
    </PageLayout >
  );
};

export default Farms;
