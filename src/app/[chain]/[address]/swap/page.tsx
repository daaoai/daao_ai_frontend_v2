'use client';
import BuySellCard from '@/components/dashboard/BuySellCard';
import FundDetails from '@/components/dashboard/fundcard-details';
import Orderbook from '@/components/dashboard/orderbook';
import { PageLayout } from '@/components/page-layout';
import { assetColumns } from '@/components/table/assets-columns';
import { AssetTable } from '@/components/table/assets-table';
import { chainIdToChainSlugMap, chainsData, chainSlugToChainIdMap, defaultChain } from '@/constants/chains';
import { fundsByChainId } from '@/data/funds';
import { useTokenBalance } from '@/hooks/token/useTokenBalance';
import { useDaaoInfo } from '@/hooks/useDaaoInfo';
import useEffectAfterMount from '@/hooks/useEffectAfterMount';
import { isChainIdSupported } from '@/utils/chains';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';

const Dashboard: React.FC = () => {
  const { chain, address } = useParams();
  const chainId = chainSlugToChainIdMap[chain as string];
  const fundAddress = address as Hex;
  const fundDetails = fundsByChainId[chainId][fundAddress];

  const fetchedBalanceRef = useRef(false);

  const { fetchTokenBalances, isTokensBalanceLoading, tokensWithBalance } = useTokenBalance({ chainId });
  const { address: account, chainId: accountChainId } = useAccount();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('trades');

  useEffect(() => {
    if (!account) return;
    if (activeTab === 'assets' && !fetchedBalanceRef.current) {
      fetchedBalanceRef.current = true;
      fetchTokenBalances();
    }
  }, [activeTab]);

  const { daoInfo, getDaaoInfo, poolDetails } = useDaaoInfo({ chainId, fundDetails });

  useEffect(() => {
    if (!account) return;
    getDaaoInfo();
  }, [account]);

  useEffectAfterMount(() => {
    if (!accountChainId) return;
    if (accountChainId === chainId) return;
    if (isChainIdSupported(accountChainId)) {
      const chainSlug = chainIdToChainSlugMap[accountChainId];
      router.replace(`/${chainSlug}`);
    } else {
      router.replace(`/${defaultChain.slug}`);
    }
  }, [accountChainId]);

  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`overflow-hidden gap-20 flex flex-col justify-center items-center pt-16 px-2`}>
        <div className="grid gap-2 md:gap-3 lg:grid-cols-[45%_55%] w-full">
          <div className="p-2 sm:p-4 flex items-center justify-center">
            <FundDetails chainId={chainId} fundDetails={fundDetails} daoInfo={daoInfo} poolDetails={poolDetails}/>
          </div>
          <div className="p-2 sm:p-4 flex items-center justify-center">
            <BuySellCard chainId={chainId} fundAddress={fundAddress} daaoInfo={daoInfo} poolDetails={poolDetails} />
          </div>
        </div>

        <div className="w-full flex justify-center lg:justify-start items-center lg:items-start px-8 border-2 border-gray-30 pt-8 rounded-md">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'trades' | 'assets')} className="w-full">
            <div className="relative w-fit">
              <TabsList className="h-12 flex items-center gap-6 mb-6 bg-[#1b1c1d] p-1 rounded-md relative">
                {/* Background Animation - Fixing alignment */}
                <motion.div
                  layoutId="tabBackground"
                  className="absolute top-0 bottom-0 left-0 bg-teal-50 rounded-md"
                  style={{ width: 'calc(100% / 2)' }} // Fix width dynamically
                  initial={false}
                  animate={{
                    x: activeTab === 'trades' ? '0%' : '100%',
                  }}
                  transition={{ type: 'tween', duration: 0.3 }}
                />

                {/* Trades Tab */}
                <TabsTrigger
                  value="trades"
                  className={`relative px-4 py-1 rounded-md text-sm font-rubik tracking-tight transition-all 
              z-10 ${activeTab === 'trades' ? 'text-black font-semibold' : 'text-gray-400'}`}
                >
                  Trades
                </TabsTrigger>

                {/* Assets Tab */}
                <TabsTrigger
                  value="assets"
                  className={`relative px-4 py-1 rounded-md text-sm font-rubik tracking-tight transition-all 
              z-10 ${activeTab === 'assets' ? 'text-black font-semibold' : 'text-gray-400'}`}
                >
                  Assets
                </TabsTrigger>
              </TabsList>
            </div>

            {/* <TabsContent value="trades" className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-7">
                  {!daoTokenAddress ? (
                    <div className="flex items-center justify-center h-[400px] sm:h-[600px] bg-card rounded-lg">
                      <p className="text-muted-foreground">Loading chart...</p>
                    </div>
                  ) : (
                    <iframe
                      className="h-[400px] w-full border-0 sm:h-[600px] rounded-lg"
                      src={`https://dexscreener.com/mode/${daoTokenAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`}
                    ></iframe>
                  )}
                </div>
                <div className="lg:col-span-3">
                  <Orderbook
                    name={props.longname}
                    created="7/02/2025"
                    owner="0xb51eC6F7D3E0D0FEae495eFe1f0751dE66b6be95"
                    token={daoTokenAddress}
                    tradingEnds="10/3/2025"
                    ethRaised="100 MODE"
                  />
                </div>
              </div>
            </TabsContent> */}
            <TabsContent value="trades" className="w-full">
              <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-4">
                {/* Left Section - 70% */}
                <div className="md:col-span-7">
                  {!daoInfo?.daoToken || !chainsData[chainId]?.dexScreenerId ? (
                    <div className="flex items-center justify-center h-[400px] sm:h-[600px]">
                      <p className="text-white text-lg">
                        {!chainsData[chainId]?.dexScreenerId ? 'Chart unavailable' : 'Loading chart...'}
                      </p>
                    </div>
                  ) : (
                    <iframe
                      className="h-[400px] w-full border-0 sm:h-[600px]"
                      src={`https://dexscreener.com/${chainsData[chainId].dexScreenerId}/${daoInfo.daoToken}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`}
                    ></iframe>
                  )}
                </div>

                {/* Right Section - 30% */}
                <div className="md:col-span-3">
                  <Orderbook daaoInfo={daoInfo} fundDetails={fundDetails} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assets" className="w-full">
              <div className="p-2 flex flex-col justify-center items-center">
                <div className="w-full flex justify-between items-center py-4">
                  <span className="font-semibold text-midGreen font-sora text-xl">Token Balances</span>
                </div>
                {/* <AssetTable columns={assetColumns} data={assetsData} /> */}
                {isTokensBalanceLoading ? (
                  <div className="flex items-center justify-center h-[400px] sm:h-[600px]">
                    <p className="text-white text-lg">Loading token balances...</p>
                  </div>
                ) : tokensWithBalance && tokensWithBalance.length > 0 ? (
                  <div className="overflow-x-auto w-full">
                    <AssetTable columns={assetColumns} data={tokensWithBalance} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] sm:h-[600px]">
                    <p className="text-white text-lg">No token balances available.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
