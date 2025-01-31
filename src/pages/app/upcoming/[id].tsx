import { PageLayout } from '@/components/page-layout';
import React, { useState, useEffect } from 'react';
import { workSans } from '@/lib/fonts';
import UpcomingFunds from '@/components/dashboard/upcoming-card';
import BurnCard from '@/components/dashboard/burncard';
import { FUND_CARD_PLACEHOLDER_IMAGE } from '@/lib/links';
import { handleContribute } from "../../../contributeFund";
import { getContractData } from "../../../getterFunctions";

const Upcoming: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [fundraisingPercent, setFundraisingPercent] = useState<number>(0);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if ((window as any).ethereum) {

          const accounts = await (window as any).ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts && accounts.length > 0) {
            setIsWalletConnected(true);
            console.log("accounts are ", accounts)
          }
        } else {
          console.warn("MetaMask not detected. Please install MetaMask.");
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);


  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const data = await getContractData();
        setFundraisingPercent((Number(data.totalRaised) / Number(data.fundraisingGoal)) * 100);
        console.log("Data is ", data)
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };

    fetchContractData();
  }, []);



  const props: UpcomingFundDetailsProps = {
    shortname: "3BC",
    twitter: "username",
    telegram: "telegram",
    website: "https://example.com",
    description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Sit eu primis ipsum ante malesuada. Conubia laoreet id vivamus ultrices fringilla suspendisse.",
    fundingProgress: fundraisingPercent,
    logo: FUND_CARD_PLACEHOLDER_IMAGE
  };


  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`w-screen overflow-hidden gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>
        <div className="grid md:grid-cols-[55%_45%] gap-6 lg:gap-8">
          <UpcomingFunds
            {...props}
          />
          <BurnCard
            fundingProgess={fundraisingPercent}
          />
        </div>

      </div>
    </PageLayout >
  );
};

export default Upcoming;
