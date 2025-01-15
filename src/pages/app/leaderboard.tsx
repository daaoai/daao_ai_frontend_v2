import { PageLayout } from '@/components/page-layout';
import React from 'react';
import { anekLatin, workSans } from '@/lib/fonts';
import { leaderboardData } from '@/lib/types';
import { LeaderboardDataTable } from '@/components/table/leaderboard-table';
import { LeaderboardColumns } from '@/components/table/leaderboard-columns';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function getLeaderboardData(): leaderboardData[] {
  return [
    {
      id: 1,
      icon: "https://via.placeholder.com/50",
      name: "SkyCoin",
      creator: "tiny_panda",
      price: 0.0125,
      dayVol: 15.3,
      marketCap: 98,
    },
    {
      id: 2,
      icon: "https://via.placeholder.com/50",
      name: "LunarToken",
      creator: "crypto_fan42",
      price: 0.025,
      dayVol: 10.8,
      marketCap: 120,
    },
    {
      id: 3,
      icon: "https://via.placeholder.com/50",
      name: "StarX",
      creator: "dreamer_88",
      price: 0.001,
      dayVol: 110,
      marketCap: 200,
    },
    {
      id: 4,
      icon: "https://via.placeholder.com/50",
      name: "NovaCoin",
      creator: "blockchain_wiz",
      price: 0.0055,
      dayVol: 6.7,
      marketCap: 40,
    },
    {
      id: 5,
      icon: "https://via.placeholder.com/50",
      name: "OrbitToken",
      creator: "tech_guru77",
      price: 0.009,
      dayVol: 3.4,
      marketCap: 12.2,
    },
    {
      id: 6,
      icon: "https://via.placeholder.com/50",
      name: "AstroX",
      creator: "cool_kid33",
      price: 0.004,
      dayVol: 8.1,
      marketCap: 56,
    },
    {
      id: 7,
      icon: "https://via.placeholder.com/50",
      name: "FusionCoin",
      creator: "alpha_trader",
      price: 0.0015,
      dayVol: 13.9,
      marketCap: 75,
    },
    {
      id: 8,
      icon: "https://via.placeholder.com/50",
      name: "HyperToken",
      creator: "moon_hunter",
      price: 0.0078,
      dayVol: 18.5,
      marketCap: 102,
    },
    {
      id: 9,
      icon: "https://via.placeholder.com/50",
      name: "ZenCrypto",
      creator: "zen_master",
      price: 0.0028,
      dayVol: 5.2,
      marketCap: 28,
    },
    {
      id: 10,
      icon: "https://via.placeholder.com/50",
      name: "PulseCoin",
      creator: "data_miner99",
      price: 0.003,
      dayVol: 9.7,
      marketCap: 34.5,
    },
    {
      id: 11,
      icon: "https://via.placeholder.com/50",
      name: "TerraCoin",
      creator: "sky_flyer",
      price: 0.011,
      dayVol: 20.4,
      marketCap: 85,
    },
    {
      id: 12,
      icon: "https://via.placeholder.com/50",
      name: "SolarX",
      creator: "nova_builder",
      price: 0.015,
      dayVol: 7.6,
      marketCap: 60,
    },
    {
      id: 13,
      icon: "https://via.placeholder.com/50",
      name: "CosmosToken",
      creator: "orbit_ninja",
      price: 0.0022,
      dayVol: 14.5,
      marketCap: 100,
    },
    {
      id: 14,
      icon: "https://via.placeholder.com/50",
      name: "InfinityCoin",
      creator: "crypto_genius",
      price: 0.0087,
      dayVol: 12.8,
      marketCap: 72.5,
    },
    {
      id: 15,
      icon: "https://via.placeholder.com/50",
      name: "CometX",
      creator: "stellar_expert",
      price: 0.0052,
      dayVol: 25.3,
      marketCap: 95.7,
    },
    {
      id: 16,
      icon: "https://via.placeholder.com/50",
      name: "NebulaToken",
      creator: "nebula_coder",
      price: 0.0035,
      dayVol: 9.9,
      marketCap: 50,
    },
    {
      id: 17,
      icon: "https://via.placeholder.com/50",
      name: "GlideCoin",
      creator: "coin_crafter",
      price: 0.0072,
      dayVol: 4.7,
      marketCap: 20,
    },
    {
      id: 18,
      icon: "https://via.placeholder.com/50",
      name: "Starburst",
      creator: "galaxy_wizard",
      price: 0.0099,
      dayVol: 18.3,
      marketCap: 89,
    },
    {
      id: 19,
      icon: "https://via.placeholder.com/50",
      name: "QuasarX",
      creator: "quantum_trader",
      price: 0.0018,
      dayVol: 16.5,
      marketCap: 65,
    },
    {
      id: 20,
      icon: "https://via.placeholder.com/50",
      name: "MeteorCoin",
      creator: "cosmic_hacker",
      price: 0.0044,
      dayVol: 6.2,
      marketCap: 37,
    },
    {
      id: 21,
      icon: "https://via.placeholder.com/50",
      name: "BlackHole",
      creator: "dark_energy",
      price: 0.0021,
      dayVol: 8.9,
      marketCap: 45,
    },
    {
      id: 22,
      icon: "https://via.placeholder.com/50",
      name: "GravityToken",
      creator: "orbital_pioneer",
      price: 0.0065,
      dayVol: 3.3,
      marketCap: 22,
    },
    {
      id: 23,
      icon: "https://via.placeholder.com/50",
      name: "AsteroidX",
      creator: "celestial_dream",
      price: 0.0091,
      dayVol: 19.7,
      marketCap: 78,
    },
    {
      id: 24,
      icon: "https://via.placeholder.com/50",
      name: "SolarFlare",
      creator: "flare_rider",
      price: 0.012,
      dayVol: 11.3,
      marketCap: 88,
    },
    {
      id: 25,
      icon: "https://via.placeholder.com/50",
      name: "PhotonX",
      creator: "light_chase",
      price: 0.012,
      dayVol: 11.3,
      marketCap: 88,
    }
  ]
}

const Leaderboard: React.FC = () => {
  const data = getLeaderboardData()

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

          <h1 className={`${workSans.className} text-bold text-2xl pt-10`}>Top DAOs</h1>
          <div className="container mx-auto">
            <LeaderboardDataTable columns={LeaderboardColumns} data={data} />
          </div>

        </div>
      </div>
    </PageLayout >
  );
};

export default Leaderboard;
