import { PageLayout } from '@/components/page-layout';
import React, { useState, useEffect } from 'react';
import { workSans } from '@/lib/fonts';
import FundDetails from '@/components/dashboard/fundcard-details';
import Buysell from '@/components/dashboard/buysell-card';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import Orderbook from '@/components/dashboard/orderbook';
import {getContractData} from "../../../getterFunctions"
import { useFetchBalance } from "../../../components/dashboard/fetchBalance"
import { useAccount } from "wagmi";
import { CURRENT_DAO_IMAGE, FUND_CARD_PLACEHOLDER_IMAGE } from '@/lib/links';


const Dashboard: React.FC = () => {
  const  account  = useAccount();
  const accountAddress = account.address as `0x${string}`;
  const { data: fetchedData, refreshData } = useFetchBalance(accountAddress);
  const [daoTokenAddress, setDaoTokenAddress] = useState('');

  
 
  useEffect(() => {
    console.log("daoToken is", fetchedData?.daoToken)
    if(!fetchedData) return;
    if (!daoTokenAddress) {
      setDaoTokenAddress(fetchedData?.daoToken)
    }
  }, [fetchedData]);



  const props: FundDetailsProps = {
    icon: CURRENT_DAO_IMAGE, // Placeholder image URL
    shortname: "CARTEL",
    longname: "",
    description: "",
    holdings: 0,
    modeAddress: "0x5edbe707191Ae3A5bd5FEa5EDa0586f7488bD961",
  };

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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-[#1b1c1d] justify-start items-center gap-6 inline-flex">
              <TabsTrigger
                value="trades"
                className="px-4 py-3 bg-[#27292a] rounded data-[state=active]:border data-[state=active]:border-black flex justify-center items-center gap-2 text-[#aeb3b6] data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <div className="text-center  text-xl font-semibold font-['Work Sans'] tracking-tight">
                  Trades
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-4">
          {/* Left Section - 70% */}
          <div className="md:col-span-7">
            { !daoTokenAddress ?(
               <div className="flex items-center justify-center h-[400px] sm:h-[600px]">
               <p className="text-white text-lg">Loading...</p>
             </div>
            ):(
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

      </div>
    </PageLayout >
  );
};

export default Dashboard;
