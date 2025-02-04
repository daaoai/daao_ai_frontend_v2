import { PageLayout } from '@/components/page-layout';
import React, { useState, useEffect } from 'react';
import { workSans } from '@/lib/fonts';
import UpcomingFunds from '@/components/dashboard/upcoming-card';
import BurnCard from '@/components/dashboard/burncard';
import { CURRENT_DAO_IMAGE, CURRENT_DAO_LINK } from '@/lib/links';
import { handleContribute } from "../../../contributeFund";
import { getContractData } from "../../../getterFunctions";
import { useAccount } from "wagmi";

const Upcoming: React.FC = () => {
  const { isConnected } = useAccount();
  const [fundraisingPercent, setFundraisingPercent] = useState<number>(0);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const data = await getContractData();
        setFundraisingPercent(
          ((Number(data.totalRaised)) / Number(data.fundraisingGoal)) * 100
        );
        console.log("Contract data:", data);
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };

    if (isConnected) {
      fetchContractData();
    }
  }, [isConnected]);


  const props: UpcomingFundDetailsProps = {
    longname: "DeFAI Cartel",
    shortname: "CARTEL",
    twitterUsername: "DeFAICartel",
    twitterLink: "https://x.com/DeFAICartel",
    telegramUsername: "defaicartel",
    telegramLink: "https://t.me/defaicartel",
    website: CURRENT_DAO_LINK,
    description: "DeFAI Venture DAO is a DeFAI Investment DAO dedicated to advancing the DeFAI movement by strategically investing in AI Agents and AI-focused DAOs on Mode. As a collective force in decentralized AI finance, $CARTEL empowers the AI-driven movement on Mode, fostering the growth of autonomous, AI-powered ecosystems.",
    aboutToken: `
      The raised funds will be used to invest in early DeFAI projects on Mode, and purchased allocations will be added to the treasury.

      $CARTEL raise will have two tiers:

      - 12,000 $MODE
      - 8,000 $MODE
    `,
    fundingProgress: parseInt(fundraisingPercent.toFixed(2)),
    logo: CURRENT_DAO_IMAGE,
  };

  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`w-screen overflow-hidden gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>
        <div className="grid md:grid-cols-[55%_45%] gap-6 lg:gap-8">
          <UpcomingFunds
            {...props}
          />
          <BurnCard
            {...props}
          />
        </div>

      </div>
    </PageLayout >
  );
};

export default Upcoming;
