import { PageLayout } from '@/components/page-layout';
import React from 'react';
import FundCard from '@/components/fund-card';

import { Work_Sans } from 'next/font/google';
export const workSans = Work_Sans({
  subsets: ["latin"],
  weight: "400",
})
import { Anek_Latin } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
export const anekLatin = Anek_Latin({
  subsets: ["latin"],
  weight: "600",
})

const AppHome: React.FC = () => {
  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>
        {/*hero section ish*/}
        <div className='flex flex-col justify-center items-center gap-10 px-4'>
          <div className='flex flex-col items-center justify-between gap-6'>
            <div className={`self-stretch text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold ${anekLatin.className} `}>
              The future of investing in Daaos world
            </div>
            <div className={`text-center text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal tracking-wide`}>
              Create or join memecoin & AI hedgefunds
            </div>
          </div>
          <div className="flex h-12 justify-start items-center gap-4 md:gap-7">
            <Button className="hover:bg-white/50 flex w-32 sm:w-36 md:w-40 lg:w-48 h-10 sm:h-11 md:h-12 px-4 py-2 sm:py-3 bg-white rounded-lg items-center justify-center">
              <span className="text-black text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-[1.1] tracking-tight">
                DASHBOARD
              </span>
            </Button>
            <Link
              href="/app/leaderboard"
            >
              <Button className="flex w-36 sm:w-40 md:w-44 lg:w-52 h-10 sm:h-11 md:h-12 px-4 py-2 sm:py-3 bg-[#28282c] hover:bg-[#28282c]/50 rounded-lg items-center justify-center">
                <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-[1.1] tracking-tight">
                  LEADERBOARD
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/*featured funds*/}
        <div className="h-min flex-col justify-center items-center gap-12 inline-flex py-2">
          <div className="self-stretch h-16 flex-col justify-center items-start gap-3 flex">
            <div className={`text-left self-stretch text-white text-3xl font-semibold ${anekLatin.className} tracking-wide`}>
              Featured Funds
            </div>
            <div className="text-left text-white text-xl font-normal tracking-tight">
              In-demand hedgefunds
            </div>
          </div>
          <div className="justify-start items-center gap-7 inline-flex px-16">
            <div className="justify-start items-center gap-10 flex">
              {Array.from({ length: 3 }).map((_, index) => (
                <FundCard
                  key={index} // Use index as key
                  title="Soul Dogs"
                  buzz="1423"
                  token="FDREAM"
                  isLive={true}
                  imgSrc="http://localhost:3000/roman-guy.svg"
                />
              ))}
            </div>
          </div>
        </div>

        {/*Upcoming funds*/}
        <div className="h-min flex-col justify-center items-center gap-12 inline-flex py-2">
          <div className="self-stretch h-16 flex-col justify-center items-start gap-3 flex">
            <div className={`text-left self-stretch text-white text-3xl font-semibold ${anekLatin.className} tracking-wide`}>
              Upcoming Funds
            </div>
            <div className="text-left text-white text-xl font-normal tracking-tight">
              Hedgefunds launching soon
            </div>
          </div>
          <div className="justify-start items-center gap-7 inline-flex px-16">
            <div className="justify-start items-center gap-10 flex">
              {Array.from({ length: 3 }).map((_, index) => (
                <FundCard
                  key={index} // Use index as key
                  title="Soul Dogs"
                  buzz="1423"
                  token="FDREAM"
                  isLive={true}
                  imgSrc="http://localhost:3000/roman-guy.svg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout >
  );
};

export default AppHome;
