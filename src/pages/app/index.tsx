'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { FundSection } from '@/components/dashboard/fundsection';
import { FUND_CARD_PLACEHOLDER_IMAGE } from '@/lib/links';
import { anekLatin, workSans } from '@/lib/fonts';

const FEATURED_FUNDS = [
  { id: '1', title: 'Soul Dogs', buzz: '1423', token: 'FDREAM', isLive: true, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  { id: '2', title: 'Crypto Cats', buzz: '982', token: 'CCAT', isLive: true, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  { id: '3', title: 'Meme Machines', buzz: '1756', token: 'MEME', isLive: true, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  { id: '4', title: 'DeFi Dragons', buzz: '2103', token: 'DDRG', isLive: true, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  { id: '5', title: 'Yield Yetis', buzz: '1234', token: 'YETI', isLive: true, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  { id: '6', title: 'Staking Sharks', buzz: '987', token: 'SHRK', isLive: true, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
];

const UPCOMING_FUNDS = [
  { id: '1', title: 'NFT Ninjas', buzz: '876', token: 'NINJA', isLive: false, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  { id: '2', title: 'Blockchain Bunnies', buzz: '654', token: 'BNNY', isLive: false, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
  { id: '3', title: 'AI Alpacas', buzz: '1098', token: 'AIAP', isLive: false, imgSrc: FUND_CARD_PLACEHOLDER_IMAGE },
];

const AppHome: React.FC = () => {
  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className="relative min-h-screen w-screen overflow-hidden">
        {/* Watermark */}
        <div className="scale-110 sm:scale-100 mr-[-20%] sm:mr-[-30%] sm:mt-[-20%] absolute top-0 right-0 w-full h-full pointer-events-none z-0">
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
              <Button className="w-1/3 sm:w-auto bg-white text-black hover:bg-white/90 text-sm sm:text-base font-semibold px-6 py-2 sm:px-8 sm:py-3">
                DASHBOARD
              </Button>
              <Link href="/app/leaderboard" className="w-full sm:w-auto">
                <Button className="w-1/3 sm:w-auto bg-[#28282c] hover:bg-[#28282c]/90 text-white text-sm sm:text-base font-semibold px-6 py-2 sm:px-8 sm:py-3">
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
          />

          {/* Upcoming funds */}
          <FundSection
            title="Upcoming Funds"
            subtitle="Hedgefunds launching soon"
            funds={UPCOMING_FUNDS}
            linkPrefix="upcoming"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AppHome;

