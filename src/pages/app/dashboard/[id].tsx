import { PageLayout } from '@/components/page-layout';
import React, { useState } from 'react';
import { workSans } from '@/lib/fonts';
import FundDetails from '@/components/dashboard/fundcard-details';
import Buysell from '@/components/dashboard/buysell-card';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import Orderbook from '@/components/dashboard/orderbook';

const Dashboard: React.FC = () => {

  const props: FundDetailsProps = {
    icon: "https://via.placeholder.com/70x70", // Placeholder image URL
    shortname: "ALCH",
    longname: "Alchemist Accelerate",
    description: "A cutting-edge platform focused on accelerating innovation in decentralized finance and blockchain technologies.",
    holdings: 0, // Initial holdings of ALCH
  };

  const [activeTab, setActiveTab] = useState("trades")

  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`w-screen overflow-hidden gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>

        <div
          className="grid gap-2 md:gap-3 lg:grid-cols-[60%_40%] lg:items-stretch"
        >
          <div className="p-4 flex items-center justify-center">
            <FundDetails {...props} />
          </div>
          <div className="p-4 flex items-center justify-center">
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
              <TabsTrigger
                value="assets"
                className="px-4 py-3 bg-[#27292a] rounded flex justify-center items-center gap-2 data-[state=active]:bg-white text-[#aeb3b6] data-[state=active]:text-black"
              >
                <div className="text-center text-xl font-semibold font-['Work Sans'] tracking-tight">
                  Assets
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-4">
          {/* Left Section - 70% */}
          <div className="md:col-span-7">
            <iframe
              className="h-[400px] w-full border-0 sm:h-[600px]"
              src="https://dexscreener.com/base/0x2b0772BEa2757624287ffc7feB92D03aeAE6F12D?embed=1&amp;info=0&amp;trades=0"
            ></iframe>
          </div>

          {/* Right Section - 30% */}
          <div className="md:col-span-3">
            <Orderbook
              name={props.longname}
              created="12/31/2024"
              owner="0x2F...3235"
              treasury="0x19...4fa7"
              token="0X2B...F12D"
              tradingEnds="7/1/2025, 12:11:37 AM"
              ethRaised="50 ETH"
            />
          </div>
        </div>

      </div>
    </PageLayout >
  );
};

export default Dashboard;
