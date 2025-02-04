import { PageLayout } from '@/components/page-layout';
import React, { useState, useEffect } from 'react';
import { workSans } from '@/lib/fonts';
import FundDetails from '@/components/dashboard/fundcard-details';
import Buysell from '@/components/dashboard/buysell-card';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import Orderbook from '@/components/dashboard/orderbook';




const Dashboard: React.FC = () => {


  const props: FundDetailsProps = {
    icon: "https://via.placeholder.com/70x70", // Placeholder image URL
    shortname: "DAO",
    longname: "To Be Announced",
    description: "This DAO has not been announced yet",
    holdings: 0

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
              src="https://dexscreener.com/mode/0x7E7985c745F016696e35a92c582c030C69803C01?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
            ></iframe>
          </div>

          {/* Right Section - 30% */}
          <div className="md:col-span-3">
            <Orderbook
              name={props.longname}
              created="12/31/2024"
              owner="0x11fd8f7B4e8Acf54Be24EE85517b90F8755E7A96"
              token="0xeadDc1199350bC3eAa586124eC84821b3fe586a1"
              tradingEnds="7/1/2025, 12:11:37 AM"
              ethRaised="100 MODE"
            />
          </div>
        </div>

      </div>
    </PageLayout >
  );
};

export default Dashboard;
