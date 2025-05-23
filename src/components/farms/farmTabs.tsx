'use client';
import FarmCard from '@/components/farms/farmCard';
import FarmCardSkeleton from '@/components/skeleton/farmCard';
import { lpFarmAddressesByChainId } from '@/constants/farm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { FarmPool, LPFarm } from '@/types/farm';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import LPFarmCard from '../lpFarms/lpFarmCard';

interface FarmTabsProps {
  activeFarms: FarmPool[];
  inactiveFarms: FarmPool[];
  lpFarms: LPFarm[];
  isLoading: boolean;
  chainId: number;
}

const FarmTabs: React.FC<FarmTabsProps> = ({ activeFarms, inactiveFarms, lpFarms, chainId, isLoading }) => {
  const [activeTab, setActiveTab] = useState('active');

  const renderLPFarms = (lpFarms: LPFarm[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex items-start gap-6 justify-start relative z-20 flex-wrap">
          <FarmCardSkeleton />
        </div>
      );
    }
    if (lpFarms.length > 0) {
      return (
        <div className="flex items-start gap-6 justify-start relative z-20 flex-wrap">
          {lpFarms.map((lpFarm, index) => (
            <LPFarmCard key={`${lpFarm.address}-${index}`} lpFarm={lpFarm} isLoading={isLoading} chainId={chainId} />
          ))}
        </div>
      );
    }
    return <div className="flex justify-center items-center text-lg text-gray-500">{emptyMessage}</div>;
  };

  const renderFarms = (farms: FarmPool[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex items-start gap-6 justify-start relative z-20 flex-wrap">
          <FarmCardSkeleton />
        </div>
      );
    }
    if (farms.length > 0) {
      return (
        <div className="flex items-start gap-6 justify-start relative z-20 flex-wrap">
          {farms.map((farm, index) => (
            <FarmCard key={`${farm.poolAddress}-${index}`} farm={farm} isLoading={isLoading} chainId={chainId} />
          ))}
        </div>
      );
    }
    return <div className="flex justify-center items-center text-lg text-gray-500">{emptyMessage}</div>;
  };

  return (
    <div>
      <div className="flex items-center justify-start gap-2 border rounded-md border-gray-20 p-4 my-8">
        <Info width={20} height={20} className="text-midGreen" />
        <p className="text-midGreen">
          Stake tokens to earn a whitelist. Degens who stay loyal are guaranteed a whitelist on daao.ai
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="relative flex justify-start items-center">
          <TabsList className="mb-4 flex space-x-2 bg-transparent p-1 border border-gray-700 rounded-md w-fit">
            <TabsTrigger
              value="active"
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'active' ? 'text-black' : 'text-gray-500'
              }`}
            >
              ACTIVE FARMS
              {activeTab === 'active' && (
                <motion.div
                  layoutId="tabBackground"
                  className="absolute inset-0 bg-teal-50 rounded-md z-[-1]"
                  transition={{ type: 'tween', stiffness: 800, damping: 80 }}
                />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'inactive' ? 'text-black' : 'text-gray-500'
              }`}
            >
              INACTIVE FARMS
              {activeTab === 'inactive' && (
                <motion.div
                  layoutId="tabBackground"
                  className="absolute inset-0 bg-teal-50 rounded-md z-[-1]"
                  transition={{ type: 'tween', stiffness: 800, damping: 80 }}
                />
              )}
            </TabsTrigger>
            {lpFarmAddressesByChainId[chainId] && (
              <TabsTrigger
                value="lpFarms"
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'lpFarms' ? 'text-black' : 'text-gray-500'
                }`}
              >
                LP FARMS
                {activeTab === 'lpFarms' && (
                  <motion.div
                    layoutId="tabBackground"
                    className="absolute inset-0 bg-teal-50 rounded-md z-[-1]"
                    transition={{ type: 'tween', stiffness: 800, damping: 80 }}
                  />
                )}
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="lpFarms">{renderLPFarms(lpFarms, 'No LP farms found.')}</TabsContent>

        <TabsContent value="active">{renderFarms(activeFarms, 'No active cards found.')}</TabsContent>

        <TabsContent value="inactive">{renderFarms(inactiveFarms, 'No inactive cards found.')}</TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmTabs;
