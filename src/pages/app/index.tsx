'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { FundSection } from '@/components/dashboard/fundsection';
import { FUND_CARD_PLACEHOLDER_IMAGE } from '@/lib/links';
import { anekLatin, workSans } from '@/lib/fonts';
import { useAccount } from "wagmi";
import { useRouter } from 'next/navigation';

const getFeaturedFunds = () => {
  return [
    { id: '1', title: 'To Be Announced', buzz: '6969', token: 'TBA', isLive: false, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  ];
}

const getUpcomingFunds = () => {
  return [
    { id: '1', title: 'Upcoming Fund', buzz: '6969', token: 'TBA', isLive: false, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  ];
}




const AppHome: React.FC = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  console.log(isConnected);
  const FEATURED_FUNDS = getFeaturedFunds();
  const UPCOMING_FUNDS = getUpcomingFunds();

  const onFundClick = (fundId: string, type: 'dashboard' | 'upcoming') => {
    if (!isConnected) {
      alert('Please connect your wallet first.');
      return;
    }
    // Navigate to the fund page if connected
    router.push(`/app/${type}/${fundId}`);
  };

  
  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className="relative min-h-screen w-screen overflow-hidden">
        {/* Watermark */}
        <div className="scale-150 sm:scale-100 mr-[-20%] sm:mr-[-30%] mt-[80%] sm:mt-[-20%] absolute top-0 right-0 w-full h-full pointer-events-none z-0">
          <Image
            src="/assets/star-1-with-purple-star.svg"
            alt="Watermark"
            layout="fill"
            objectPosition="right top"
            className="object-contain"
          />
        </div>

        <div className={`${workSans.className} relative flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12 md:space-y-24`}>
          {/* Hero section */}
          <section className='flex flex-col justify-center items-center gap-6 md:gap-10 text-center max-w-4xl'>
            <h1 className={`text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold ${anekLatin.className} leading-tight`}>
              The future of investing in Daaos world
            </h1>
            <p className={`text-white text-base sm:text-lg md:text-xl lg:text-2xl font-normal tracking-wide`}>
              Create or join memecoin & AI hedgefunds
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md">
              <Link href="/app/dashboard" className="w-full sm:w-auto">
                <Button className="w-[125px] sm:w-auto bg-white text-black hover:bg-white/90 text-sm sm:text-base font-semibold px-6 py-2 sm:px-8 sm:py-3">
                  DASHBOARD
                </Button>
              </Link>
              <Link href="/app/leaderboard" className="w-full sm:w-auto">
                <Button className="w-[125px] sm:w-auto bg-[#28282c] hover:bg-[#28282c]/90 text-white text-sm sm:text-base font-semibold px-6 py-2 sm:px-8 sm:py-3">
                  LEADERBOARD
                </Button>
              </Link>
            </div>
          </section>
          

          {/* Featured funds */}
          <FundSection
            title="Featured Funds"
            subtitle="In-demand hedgefunds"
            funds={FEATURED_FUNDS}
            onFundClick={(fundId) => onFundClick(fundId, 'dashboard')}
          />

          {/* Upcoming funds */}
          <FundSection
            title="Upcoming Funds"
            subtitle="Hedgefunds launching soon"
            funds={UPCOMING_FUNDS}
            linkPrefix="upcoming"
            onFundClick={(fundId) => onFundClick(fundId, 'upcoming')}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AppHome;

