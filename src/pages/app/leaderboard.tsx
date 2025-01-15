import { PageLayout } from '@/components/page-layout';
import React from 'react';
import { anekLatin, workSans } from '@/lib/fonts';
import { leaderboardData } from '@/lib/types';
import { LeaderboardDataTable } from '@/components/table/leaderboard-table';
import { LeaderboardColumns } from '@/components/table/leaderboard-columns';

function getLeaderboardData(): leaderboardData[] {
  return [
    {
      id: 1,
      icon: "https://via.placeholder.com/50",
      name: "CryptoKing",
      creator: "Alice",
      price: 0.015,
      dayVol: 12.5,
      marketCap: 100,
    },
    {
      id: 2,
      icon: "https://via.placeholder.com/50",
      name: "DeFiStar",
      creator: "Bob",
      price: 0.03,
      dayVol: 8.9,
      marketCap: 75,
    },
    {
      id: 3,
      icon: "https://via.placeholder.com/50",
      name: "TokenX",
      creator: "Charlie",
      price: 0.00075,
      dayVol: 120,
      marketCap: 250,
    },
    {
      id: 4,
      icon: "https://via.placeholder.com/50",
      name: "MetaCoin",
      creator: "Dana",
      price: 0.002,
      dayVol: 5.6,
      marketCap: 32,
    },
    {
      id: 5,
      icon: "https://via.placeholder.com/50",
      name: "GalaxyToken",
      creator: "Eve",
      price: 0.0075,
      dayVol: 2.3,
      marketCap: 8.5,
    },
    {
      id: 1,
      icon: "https://via.placeholder.com/50",
      name: "CryptoKing",
      creator: "Alice",
      price: 0.015,
      dayVol: 12.5,
      marketCap: 100,
    },
    {
      id: 2,
      icon: "https://via.placeholder.com/50",
      name: "DeFiStar",
      creator: "Bob",
      price: 0.03,
      dayVol: 8.9,
      marketCap: 75,
    },
    {
      id: 3,
      icon: "https://via.placeholder.com/50",
      name: "TokenX",
      creator: "Charlie",
      price: 0.00075,
      dayVol: 120,
      marketCap: 250,
    },
    {
      id: 4,
      icon: "https://via.placeholder.com/50",
      name: "MetaCoin",
      creator: "Dana",
      price: 0.002,
      dayVol: 5.6,
      marketCap: 32,
    },
    {
      id: 5,
      icon: "https://via.placeholder.com/50",
      name: "GalaxyToken",
      creator: "Eve",
      price: 0.0075,
      dayVol: 2.3,
      marketCap: 8.5,
    },
    {
      id: 1,
      icon: "https://via.placeholder.com/50",
      name: "CryptoKing",
      creator: "Alice",
      price: 0.015,
      dayVol: 12.5,
      marketCap: 100,
    },
    {
      id: 2,
      icon: "https://via.placeholder.com/50",
      name: "DeFiStar",
      creator: "Bob",
      price: 0.03,
      dayVol: 8.9,
      marketCap: 75,
    },
    {
      id: 3,
      icon: "https://via.placeholder.com/50",
      name: "TokenX",
      creator: "Charlie",
      price: 0.00075,
      dayVol: 120,
      marketCap: 250,
    },
    {
      id: 4,
      icon: "https://via.placeholder.com/50",
      name: "MetaCoin",
      creator: "Dana",
      price: 0.002,
      dayVol: 5.6,
      marketCap: 32,
    },
    {
      id: 5,
      icon: "https://via.placeholder.com/50",
      name: "GalaxyToken",
      creator: "Eve",
      price: 0.0075,
      dayVol: 2.3,
      marketCap: 8.5,
    },
    {
      id: 1,
      icon: "https://via.placeholder.com/50",
      name: "CryptoKing",
      creator: "Alice",
      price: 0.015,
      dayVol: 12.5,
      marketCap: 100,
    },
    {
      id: 2,
      icon: "https://via.placeholder.com/50",
      name: "DeFiStar",
      creator: "Bob",
      price: 0.03,
      dayVol: 8.9,
      marketCap: 75,
    },
    {
      id: 3,
      icon: "https://via.placeholder.com/50",
      name: "TokenX",
      creator: "Charlie",
      price: 0.00075,
      dayVol: 120,
      marketCap: 250,
    },
    {
      id: 4,
      icon: "https://via.placeholder.com/50",
      name: "MetaCoin",
      creator: "Dana",
      price: 0.002,
      dayVol: 5.6,
      marketCap: 32,
    },
    {
      id: 5,
      icon: "https://via.placeholder.com/50",
      name: "GalaxyToken",
      creator: "Eve",
      price: 0.0075,
      dayVol: 2.3,
      marketCap: 8.5,
    },
  ];
}

const Leaderboard: React.FC = () => {
  const data = getLeaderboardData()

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
            <button className="flex w-32 sm:w-36 md:w-40 lg:w-48 h-10 sm:h-11 md:h-12 px-4 py-2 sm:py-3 bg-white rounded-lg items-center justify-center">
              <span className="text-black text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-[1.1] tracking-tight">
                DASHBOARD
              </span>
            </button>
            <button className="flex w-36 sm:w-40 md:w-44 lg:w-52 h-10 sm:h-11 md:h-12 px-4 py-2 sm:py-3 bg-[#28282c] rounded-lg items-center justify-center">
              <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-[1.1] tracking-tight">
                LEADERBOARD
              </span>
            </button>
          </div>
        </div>

        <div className="container mx-auto py-10">
          <LeaderboardDataTable columns={LeaderboardColumns} data={data} />
        </div>

      </div>
    </PageLayout >
  );
};

export default Leaderboard;
