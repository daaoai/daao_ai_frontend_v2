'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import FarmCardSkeleton from '@/components/skeleton/farmCard';
import FarmCard from '@/components/farms/farmCard';
import { FarmPool } from '@/types/farm';
import { Info } from 'lucide-react';

interface FarmTabsProps {
  activeFarms: FarmPool[];
  inactiveFarms: FarmPool[];
  isLoading: boolean;
}

const FarmTabs: React.FC<FarmTabsProps> = ({ activeFarms, inactiveFarms, isLoading }) => {
  const [activeTab, setActiveTab] = useState('active');

  const renderFarms = (farms: FarmPool[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex items-start gap-6 justify-center relative z-20 flex-wrap">
          <FarmCardSkeleton />
        </div>
      );
    }
    if (farms.length > 0) {
      return (
        <div className="flex items-start gap-6 justify-center relative z-20 flex-wrap">
          {farms.map((farm, index) => (
            <FarmCard key={`${farm.poolAddress}-${index}`} farm={farm} isLoading={isLoading} />
          ))}
        </div>
      );
    }
    return <div className="flex justify-center items-center text-lg text-gray-500">{emptyMessage}</div>;
  };

  return (
    <div>
      {/* <div className="flex items-center justify-start gap-2 border rounded-md border-text-green p-4 my-8">
        <Info width={60} height={60} className="text-midGreen" />
        <p className="text-midGreen">
          Stake your DAO tokens to earn Daao.ai Whitelist Tokens (CARTEL). Burn 1M CARTEL for a guaranteed lowest tier
          whitelist spot on any Daao.ai project, or burn less for a weighted raffle entry. CARTEL is a whitelist utility
          token with no inherent market value. It is not a governance or platform token. Do not trade or speculate on
          it.
        </p>
      </div> */}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="relative flex justify-center items-center">
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
          </TabsList>
        </div>

        <TabsContent value="active">{renderFarms(activeFarms, 'No active cards found.')}</TabsContent>

        <TabsContent value="inactive">{renderFarms(inactiveFarms, 'No inactive cards found.')}</TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmTabs;
