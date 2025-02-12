import { PageLayout } from '@/components/page-layout';
import React, { useState, useEffect } from 'react';
import { workSans } from '@/lib/fonts';
import FundDetails from '@/components/dashboard/fundcard-details';
import Buysell from '@/components/dashboard/buysell-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import Orderbook from '@/components/dashboard/orderbook';
import { getContractData } from "../../../getterFunctions"
import { useFetchBalance } from "../../../components/dashboard/fetchBalance"
import { useAccount } from "wagmi";
import { CURRENT_DAO_IMAGE, FUND_CARD_PLACEHOLDER_IMAGE } from '@/lib/links';
import { AssetTable } from '@/components/table/assets-table';
import { assetColumns } from '@/components/table/assets-columns';
import { useFundContext } from "../../../components/dashboard/FundContext";

const Dashboard: React.FC = () => {
  const account = useAccount();
  const accountAddress = account.address as `0x${string}`;
  const { data: fetchedData, refreshData } = useFetchBalance(accountAddress);
  const [daoTokenAddress, setDaoTokenAddress] = useState('');
  const { daoBalance, priceUsd } = useFundContext();
  useEffect(() => {
    console.log("daoToken is", fetchedData?.daoToken)
    if (!fetchedData) return;
    if (!daoTokenAddress) {
      setDaoTokenAddress(fetchedData?.daoToken)
    }
  }, [fetchedData]);

  const props: FundDetailsProps = {
    icon: CURRENT_DAO_IMAGE, // Placeholder image URL
    shortname: "CARTEL",
    longname: "",
    description: "Alchemist Accelerate is a DAO dedicated to driving innovation at the intersection of AI and Web3. We invest in transformative projects, create educational resources in multiple languages, and provide mentorship and connections to empower a global community. Our mission is to break barriers, foster innovation, and build a sustainable, decentralized future.",
    holdings: 0,
    modeAddress: "0x5edbe707191Ae3A5bd5FEa5EDa0586f7488bD961",
  };

  const assetsData: Asset[] = [
    {
      token: "CARTEL",
      tokenIcon: CURRENT_DAO_IMAGE,
      balance: Number(daoBalance),
      price: priceUsd,
      totalValue: priceUsd * Number(daoBalance),
    },
  ]

  const [activeTab, setActiveTab] = useState("trades")

  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`w-screen overflow-hidden gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>

        <div
          className="grid gap-2 md:gap-3 lg:grid-cols-[60%_40%] w-full"
        >
          <div className="p-2 sm:p-4 flex items-center justify-center">
            <FundDetails {...props} />
          </div>
          <div className="p-2 sm:p-4 flex items-center justify-center">
            <Buysell />
          </div>
        </div>

        <div className='w-full flex justify-center lg:justify-start items-center lg:items-start px-8 py-0 my-0'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* <TabsList className="h-12 bg-[#1b1c1d] justify-start items-center gap-6 inline-flex mb-6"> */}
            <TabsList className="h-12  justify-start items-center gap-6 mb-6 flex">

              <TabsTrigger
                value="trades"
                className="px-4 py-3 rounded border justify-center items-center gap-2 flex transition-all 
               data-[state=active]:bg-green-400  data-[state=inactive]:bg-gray-300 data-[state=inactive]:text-black data-[state=active]:border-black 
               data-[state=active]:text-black data-[state=active]:text-xl 
               bg-[#27292a] text-[#aeb3b6] text-lg"
              >
                <span className="font-semibold font-['Work Sans'] tracking-tight">
                  Trades
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="px-4 py-3 rounded justify-center items-center gap-2 flex transition-all 
                data-[state=active]:bg-green-400 data-[state=active]:border-black data-[state=inactive]:bg-gray-300 data-[state=inactive]:text-black
               data-[state=active]:text-black data-[state=active]:text-xl 
               bg-[#27292a] text-[#aeb3b6] text-lg"
              >
                <span className="font-semibold font-['Work Sans'] tracking-tight">
                  Assets
                </span>
              </TabsTrigger>
            </TabsList>

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
                  {!daoTokenAddress ? (
                    <div className="flex items-center justify-center h-[400px] sm:h-[600px]">
                      <p className="text-white text-lg">Loading...</p>
                    </div>
                  ) : (
                    <iframe
                      className="h-[400px] w-full border-0 sm:h-[600px]"
                      src={`https://dexscreener.com/mode/${daoTokenAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`}
                    ></iframe>
                  )
                  }
                </div>

                {/* Right Section - 30% */}
                <div className="md:col-span-3">
                  <Orderbook
                    name={props.longname}
                    created="7/02/2025"
                    owner="0xb51eC6F7D3E0D0FEae495eFe1f0751dE66b6be95"
                    token={daoTokenAddress}
                    tradingEnds="10/3/2025"
                    ethRaised="1,000,000 MODE"
                  />
                </div>
              </div>
            </TabsContent>



            <TabsContent value="assets" className="w-full">
              <div className="p-2 flex flex-col justify-center items-center">
                <div className="w-full flex justify-between items-center py-4">
                  <span className='font-bold text-xl'>Token Balances</span>
                </div>
                <AssetTable columns={assetColumns} data={assetsData} />
              </div>
            </TabsContent>
          </Tabs>

        </div>




      </div>
    </PageLayout >
  );
};

export default Dashboard;
