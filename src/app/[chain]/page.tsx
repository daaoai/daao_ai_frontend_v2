'use client';
import { FundSection } from '@/components/dashboard/fundsection';
import FAQDaao from '@/components/faqDaao';
import { PageLayout } from '@/components/page-layout';
import PoolDetailCard from '@/components/poolDetailCard';
import { chainSlugToChainIdMap } from '@/constants/chains';
import { getDexName, getDexURL } from '@/constants/dex';
import { fundsByChainId, tbaDaao } from '@/data/funds';
import { fetchDaaoBasicInfo, fetchDaoMarketData } from '@/helpers/daao';
import { BasicDaoInfo, DaoMarketData, FundDetails } from '@/types/daao';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { toast as reactToast } from 'react-toastify';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';

const FundsPage: NextPage = () => {
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [highlightedFundMarketData, setHighlightedFundMarketData] = useState<DaoMarketData>({
    price: 0,
    marketCap: 0,
    liquidity: 0,
    volume: 0,
  });
  const [daaosBasicInfo, setDaaosBasicInfo] = useState<Record<string, BasicDaoInfo> | null>(null);
  const { isConnected } = useAccount();
  const router = useRouter();
  const { chain } = useParams();

  const chainId = chainSlugToChainIdMap[chain as string];
  const activeFunds = Object.values(fundsByChainId[chainId]);

  const FEATURED_FUNDS: FundDetails[] = [
    ...activeFunds,
    ...Array(2)
      .fill(null)
      .map((_, index) => tbaDaao((index + 1).toString())),
  ].slice(0, 3);

  const UPCOMING_FUNDS: FundDetails[] = [
    ...Array(3)
      .fill(null)
      .map((_, index) => tbaDaao((index + 1).toString())),
  ];

  const highlightedFund = activeFunds[0];

  useEffect(() => {
    updateDaaoDetails();
  }, []);

  useEffect(() => {
    // Fetch market data for the highlighted fund
    if (isStatusLoading) return;
    fetchHighlightedFundMarketData();
  }, [daaosBasicInfo, isStatusLoading]);

  const updateDaaoDetails = async () => {
    setIsStatusLoading(true);
    await Promise.allSettled(
      activeFunds.map(async (fund) => {
        const res = await fetchDaaoBasicInfo({
          chainId,
          daoAddress: fund.address,
        });
        setDaaosBasicInfo((prev) => ({
          ...prev,
          [fund.address]: res,
        }));
      }),
    );
    setIsStatusLoading(false);
  };

  const fetchHighlightedFundMarketData = async () => {
    const highlightedFundDetails = daaosBasicInfo?.[highlightedFund.address];
    if (!highlightedFundDetails || !highlightedFundDetails.fundraisingFinalized) return;
    const { daaoToken } = highlightedFundDetails;
    const res = await fetchDaoMarketData({
      chainId,
      daaoToken: daaoToken as Hex,
    });
    if (res) {
      setHighlightedFundMarketData(res);
    }
  };

  const onFundClick = (fundAddress: string) => {
    if (!isConnected) {
      reactToast.error('Please connect your wallet to proceed.');
    }
    if (isStatusLoading) {
      reactToast.error('Loading... Please wait while we fetch the latest data.');
      return;
    }
    // Navigate to the fund page if connected
    const isFundraisingFinalized = daaosBasicInfo?.[fundAddress]?.fundraisingFinalized || false;

    if (isFundraisingFinalized) {
      router.push(`/${chain}/${fundAddress}/swap`);
    } else {
      router.push(`/${chain}/${fundAddress}/contribute`);
    }
  };

  return (
    <PageLayout>
      <div className="relative">
        {/* Background image */}
        {/* <div className="absolute inset-0 z-0 top-[22rem] pt-[23rem] -left-[8rem]">
          <Image
            src="/assets/brand.svg"
            alt="Background Asset"
            layout="fill"
            objectFit="cover"
            className=" absolute opacity-80"
          />
        </div> */}

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10 lg:gap-20 w-full pt-24 items-center">
          <Image
            src={highlightedFund.imgSrc}
            alt={highlightedFund.title}
            width={400}
            height={400}
            onClick={() => onFundClick(highlightedFund.address)}
            className="cursor-pointer w-[25rem] h-[25rem]"
          />
          <div className="flex flex-col sm:items-start gap-6">
            <p className="text-5xl font-sora font-medium text-white">{highlightedFund.title}</p>
            {!isStatusLoading && daaosBasicInfo?.[highlightedFund.address]?.fundraisingFinalized && (
              <Link
                href={getDexURL({
                  chainId,
                  type: highlightedFund.dexInfo.type,
                  daaoToken: daaosBasicInfo?.[highlightedFund.address]?.daaoToken,
                  paymentToken: daaosBasicInfo?.[highlightedFund.address]?.paymentToken,
                })}
                target="_blank"
                className="text-teal-60 font-normal"
              >
                Trade On {getDexName(highlightedFund.dexInfo.type)}
              </Link>
            )}
            <p className="text-gray-10 font-normal font-rubik text-lg text-left">{highlightedFund.description}</p>
            {!isStatusLoading && daaosBasicInfo?.[highlightedFund.address]?.fundraisingFinalized && (
              <PoolDetailCard
                marketCap={highlightedFundMarketData.marketCap}
                liquidity={highlightedFundMarketData.liquidity || 0}
                volume={highlightedFundMarketData.volume || 0}
              />
            )}
          </div>
        </div>
      </div>
      <div className="relative w-full">
        <div className="absolute inset-0 z-0 -top-24 pt-[23rem] -left-[8rem]">
          <Image
            src="/assets/brand.svg"
            alt="Background Asset"
            layout="fill"
            objectFit="cover"
            className=" absolute opacity-80"
          />
        </div>
      </div>

      <div className="mb-18 mt-52 w-full flex flex-col gap-5">
        <p className="text-white font-regular text-3xl md:text-5xl">&lt;&lt;&lt;Featured Funds&gt;&gt;&gt;</p>
        <FundSection funds={FEATURED_FUNDS} onFundClick={(fundAddress) => onFundClick(fundAddress)} chainId={chainId} />
      </div>

      <div className="my-24 flex flex-col gap-5 w-full">
        <p className="text-white font-regular text-3xl md:text-5xl">&lt;&lt;&lt;Upcoming Funds&gt;&gt;&gt;</p>
        <FundSection funds={UPCOMING_FUNDS} onFundClick={(fundAddress) => onFundClick(fundAddress)} chainId={chainId} />
      </div>

      <div className="relative w-full">
        <div className="absolute inset-0 z-0 -left-[13rem]">
          <Image
            src="/assets/brand.svg"
            alt="Background Asset"
            layout="fill"
            className="absolute opacity-90  filter blur-sm"
          />
        </div>
        <div className="flex flex-col gap-16 items-center justify-center">
          <Image src="/assets/circle-image.svg" alt="defai-cartel" width={300} height={400} />
          <div className="flex flex-col gap-8 items-center z-10">
            <p className="text-teal-40 font-normal font-sora text-2xl md:text-4xl">Available to everyone</p>
            <p className="text-3xl sm:text-4xl lg:text-7xl font-sora font-normal text-white max-w-4xl">
              Launch your next fund on D.A.A.O
            </p>
            {/* <div className='bg-'> */}
            <Link href="https://t.me/arcanelabs" className="text-black w-fit bg-white rounded-full px-4 py-2">
              Launch A DAO
            </Link>
            {/* </div> */}
          </div>
        </div>
      </div>

      <div className="w-full md:w-8/12 max-w-xl flex items-center flex-col mt-20">
        <p className="text-center text-3xl font-bold">FAQs</p>
        <FAQDaao />
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

export default FundsPage;
