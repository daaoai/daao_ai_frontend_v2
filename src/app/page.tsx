'use client';
import { PageLayout } from '@/components/page-layout';
import { NextPage } from 'next/types';
import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/typography';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { CURRENT_DAO_IMAGE, DefaiCartelLinks, FUND_CARD_PLACEHOLDER_IMAGE, WHITEPAPER_URL } from '@/constants/links';
import { Link as UILink } from 'lucide-react';
import { FooterIconLink } from '@/components/footer';
import CheckWaitlistModal from '@/components/landing/waitlist-modal';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '@/daao-sdk/abi/abi';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { formatNumber } from '@/utils/numbers';
import { daoAddress } from '@/constants/addresses';
import { FundSection } from '@/components/dashboard/fundsection';
import type { Fund } from '@/types/fund';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ConnectWalletButton } from '@/components/connect-button';

const HomePage: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState<number | null>(0);
  const [marketCap, setMarketCap] = useState<number | null>(0);

  const { isConnected } = useAccount();
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const modeRpc = 'https://mainnet.mode.network/';
    const fetchMarketData = async () => {
      const provider = new ethers.providers.JsonRpcProvider(modeRpc);

      // const signer = provider.getSigner();

      const contract = new ethers.Contract(daoAddress as string, CONTRACT_ABI, provider);
      const daoToken = await contract.daoToken();
      // setDaoTokenAddress(daoToken)
      // if (!daoTokenAddress) return

      // const url = `https://api.dexscreener.com/token-pairs/v1/mode/${daoTokenAddress}`
      const url = `https://api.dexscreener.com/token-pairs/v1/mode/${daoToken}`;
      console.log('url is ', url);
      try {
        // Replace with your actual endpoint or logic
        const response = await fetch(url);
        const data = await response.json();
        console.log('Data from api is  is ', data);

        if (data && Array.isArray(data) && data[0]) {
          setPrice(data[0].priceUsd);
          const marketCap = Number(data[0].marketCap).toFixed(0);
          setMarketCap(Number(marketCap));
        } else {
          console.warn('Market data not in expected format.');
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };
    fetchMarketData();
  }, []);

  const getFeaturedFunds = (): Fund[] => {
    return [
      {
        id: '1',
        title: 'DeFAI Cartel',
        token: 'CARTEL',
        status: 'trading',
        imgSrc: CURRENT_DAO_IMAGE,
      },
      {
        id: '178',
        title: 'To Be Announced',
        token: 'TBA',
        status: 'soon',
        imgSrc: FUND_CARD_PLACEHOLDER_IMAGE,
      },
      {
        id: '179',
        title: 'To Be Announced',
        token: 'TBA',
        status: 'live',
        imgSrc: FUND_CARD_PLACEHOLDER_IMAGE,
      },
      {
        id: '180',
        title: 'To Be Announced',
        token: 'TBA',
        status: 'live',
        imgSrc: FUND_CARD_PLACEHOLDER_IMAGE,
      },
      {
        id: '181',
        title: 'To Be Announced',
        token: 'TBA',
        status: 'live',
        imgSrc: FUND_CARD_PLACEHOLDER_IMAGE,
      },
      {
        id: '182',
        title: 'To Be Announced',
        token: 'TBA',
        status: 'live',
        imgSrc: FUND_CARD_PLACEHOLDER_IMAGE,
      },
    ];
  };

  const FEATURED_FUNDS: Fund[] = getFeaturedFunds();

  const onFundClick = (fundId: string, type: 'dashboard' | 'upcoming') => {
    if (!isConnected) {
      // alert('Please connect your wallet first.');
      toast({
        title: 'Please connect your wallet first',
        description: "It looks like your wallet isn't connected",
        variant: 'destructive',
        action: <ConnectWalletButton icons={false} className="bg-white text-black" />,
      });
      return;
    }
    // Navigate to the fund page if connected
    router.push(`/dapp/${type}/${fundId}`);
  };

  return (
    <PageLayout>
      <div className="flex justify-between gap-20 w-full pt-24">
        <Image src="/assets/defaiCartel.svg" alt="defai-cartel" width={400} height={400} />
        <div className="flex flex-col items-start">
          <p>Defai Cartel</p>
          <Link href="https://velodrome.finance/swap?from=0xdfc7c877a950e49d2610114102175a06c2e3167a&to=0x98e0ad23382184338ddcec0e13685358ef845f30&chain0=34443&chain1=34443">
            Trade On Velodrome
          </Link>
          <p>
            Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet
            odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            Curabitur tempus urna at turpis condimentum lobortis.
          </p>
        </div>
      </div>
      <div>
        <p>&lt;&lt;&lt;Featured Funds&gt;&gt;&gt;</p>
        <FundSection funds={FEATURED_FUNDS} onFundClick={(fundId) => onFundClick(fundId, 'dashboard')} />
      </div>

      <div className="flex flex-col pt-16 gap-16 items-center justify-center">
        <Image src="/assets/circle-image.svg" alt="defai-cartel" width={300} height={400} />
        <div className="flex flex-col gap-8 items-center">
          <p className="text-teal-40 font-normal font-sora text-4xl">Available to everyone</p>
          <p className="text-7xl font-sora font-normal text-white max-w-4xl">Launch your next fund on D.A.A.O</p>
          {/* <div className='bg-'> */}
          <button className="text-black w-fit bg-white rounded-full px-4 py-2">Launch A DAO</button>
          {/* </div> */}
        </div>
      </div>
      <div>
        <p>Faqs</p>
      </div>

      {/* <div className="sm:my-[-40px] relative flex justify-center items-center h-max">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Typography variant="h1" className={`text-center text-white text-3xl md:text-5xl lg:text-6xl`}>
            Decentralized Autonomous
            <br />
            Agentic Organization
          </Typography>
          <Typography
            variant="h3"
            className={`lg:pt-6 pt-2 text-center text-white lg:text-xl w-5/6 md:text-lg text-sm`}
          >
            Where autonomous agents meet decentralized innovation, driving seamless collaboration for a smarter future.
          </Typography>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-min">
            <Link href={WHITEPAPER_URL} target="_blank" className="w-full">
              <Button
                variant="default"
                className={`w-full py-4 sm:py-6 px-6 sm:px-10 bg-white rounded-lg border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              >
                <div className={`text-center text-black text-base sm:text-xl font-normal leading-tight tracking-wide`}>
                  Whitepaper
                </div>
              </Button>
            </Link>
            <Link href="/dapp" className="w-full">
              <Button
                variant="ghost"
                className={`py-4 sm:py-6 px-6 sm:px-10 bg-transparent rounded-lg xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              >
                <div className="flex justify-center items-center gap-2 text-center text-white text-sm sm:text-base font-normal goldman leading-tight tracking-wide">
                  Go to app <ArrowRight />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div> */}

      {/* <CheckWaitlistModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}

      {/*waitlist*/}
      {/* <Card className="w-[calc(100%-2rem)] max-w-[500px] bg-gradient-to-br from-black via-[#061023] to-[#0e070e] rounded-2xl shadow-[0px_4px_36px_0px_rgba(255,255,255,0.10)] border border-[#212121]">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-6 sm:p-8">
          <div className="relative w-full max-w-[250px] aspect-square rounded-xl overflow-hidden">
            <Image src={CURRENT_DAO_IMAGE} alt="DeFAI Cartel" layout="fill" objectFit="cover" />
          </div>
          <Link href="/dapp">
            <div className="flex flex-col items-center gap-2">
              <h2 className={`text-center text-white text-xl sm:text-2xl font-normal  leading-tight tracking-wide`}>
                DeFAI Cartel
              </h2>

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex gap-4">
                  <p className={`text-white text-sm sm:text-base `}>
                    Price: <span className="text-[#d1ea48]">$ {Number(price).toFixed(6)}</span>
                  </p>
                  <p className={`text-white text-sm sm:text-base`}>
                    MCAP: <span className="text-[#d1ea48]">{formatNumber(Number(marketCap || 0))}</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="https://velodrome.finance/swap?from=0xdfc7c877a950e49d2610114102175a06c2e3167a&to=0x98e0ad23382184338ddcec0e13685358ef845f30&chain0=34443&chain1=34443"
            target="_blank"
          >
            <div className="flex items-center gap-1.5 justify-center bg-blue-950 p-2 rounded-md border-2 border-[#d1ea48] animate-pulse transition-all duration-2000 hover:scale-105">
              <span className={`text-[#d1ea48] text-sm`}>Trade On Velodrome</span>
              <ArrowRight className="w-4 h-4 text-[#d1ea48]" />
            </div>
          </Link>

          <div className="flex flex-wrap justify-center gap-4">
            {DefaiCartelLinks.map((social, index) => (
              <FooterIconLink key={index} href={social.href} label={social.label}>
                {!social.src ? <UILink /> : <Image src={social.src} alt={social.alt} width={20} height={20} />}
              </FooterIconLink>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </PageLayout>
  );
};

export default HomePage;
