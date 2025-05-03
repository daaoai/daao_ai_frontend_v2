import { telegramDeFAILink, twitterDeFAILink } from '@/constants/links';
import { fetchDaoMarketData } from '@/helpers/daao';
import { Card } from '@/shadcn/components/ui/card';
import { DaoInfo, DaoMarketData, FundDetails as FundDetailsType } from '@/types/daao';
import { PoolDetails } from '@/types/pool';
import { shortenAddress } from '@/utils/address';
import { getLocalTokenDetails } from '@/utils/token';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import ClickToCopy from '../copyToClipboard';
import Liquidity from '../Liquidity/liquidity';
import LPFarms from '../lpFarms';
import { ModalWrapper } from '../modalWrapper';
import PoolDetailCard from '../poolDetailCard';
import { lpFarmAddressesByChainId } from '@/constants/farm';

const FundDetails = ({
  fundDetails,
  chainId,
  daoInfo,
  poolDetails,
}: {
  fundDetails: FundDetailsType;
  chainId: number;
  daoInfo: DaoInfo | null;
  poolDetails: PoolDetails | null;
}) => {
  const [marketData, setMarketData] = useState<DaoMarketData>({
    liquidity: 0,
    marketCap: 0,
    price: 0,
    volume: 0,
  });
  const [isLiquidityModalOpen, setIsLiquidityModalOpen] = useState(false);
  const openLiquidityModalOpen = useCallback(() => setIsLiquidityModalOpen(true), []);
  const closeLiquidityModalOpen = useCallback(() => setIsLiquidityModalOpen(false), []);
  const [isLPFarmModalOpen, setIsLPFarmModalOpen] = useState(false);
  const openFarmModalOpen = useCallback(() => setIsLPFarmModalOpen(true), []);
  const closeFarmModalOpen = useCallback(() => setIsLPFarmModalOpen(false), []);

  const tokenDetails = getLocalTokenDetails({ address: fundDetails.token, chainId });

  const updateMarketData = async () => {
    if (!daoInfo?.daoToken || daoInfo.daoToken === zeroAddress) return;
    const data = await fetchDaoMarketData({ chainId, daaoToken: daoInfo.daoToken });
    if (data) {
      setMarketData(data);
    }
  };

  useEffect(() => {
    updateMarketData();
  }, [daoInfo]);

  const calculateTokenChange = (marketCap: number, percentageChange: number): number => {
    return (marketCap * percentageChange) / 100;
  };

  const lpFarmForPool = Object.values(lpFarmAddressesByChainId[chainId]).find(
    (lpFarm) => lpFarm.poolAddress.toLowerCase() === poolDetails?.address.toLowerCase(),
  );

  return (
    <Card className="text-white sm:p-2  w-full border-none">
      <div className="w-full">
        <Image src={fundDetails.imgSrc} alt={fundDetails.title} width={600} height={300} style={{ width: '100%' }} />
      </div>

      {/* <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex-shrink-0 overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src={props.icon}
              width={70}
              height={70}
              alt={`${props.longname} icon`}
            />
          </div>
          <CardTitle className={`text-xl sm:text-2xl md:text-3xl font-semibold`}>
            ${props.shortname} {props.longname}
          </CardTitle>
        </div> */}
      {(fundDetails.isManageLiquidityEnabled || fundDetails.isLpFarmsEnabled) && daoInfo && poolDetails && (
        <div className="border-2 border-gray-30 rounded-md mt-4 p-6 flex items-center gap-6">
          {fundDetails.isManageLiquidityEnabled && (
            <button
              className="bg-teal-50 text-black text-sm rounded-md p-2 hover:bg-teal-60 active:scale-95 transition-transform ease-in-out duration-150"
              onClick={openLiquidityModalOpen}
            >
              Manage
            </button>
          )}
          {fundDetails.isLpFarmsEnabled && lpFarmForPool && (
            <button
              className="underline text-teal-50 text-sm rounded-md p-2 active:scale-95 transition-transform ease-in-out duration-150"
              onClick={openFarmModalOpen}
            >
              LP Farms
            </button>
          )}
          <ModalWrapper isOpen={isLiquidityModalOpen} onClose={closeLiquidityModalOpen} className="!max-w-[56rem]">
            <Liquidity
              onClose={closeLiquidityModalOpen}
              daoInfo={daoInfo}
              poolDetails={poolDetails}
              fundDetails={fundDetails}
              chainId={chainId}
            />
          </ModalWrapper>
          <ModalWrapper isOpen={isLPFarmModalOpen} onClose={closeFarmModalOpen}>
            <LPFarms onClose={closeFarmModalOpen} chainId={chainId} lpFarmAddress={lpFarmForPool!.lpFarm} />
          </ModalWrapper>
          {/* 
          <div className="flex flex-col gap-2">
            <p className="text-gray-70 font-rubik text-sm font-normal">LP VALUE</p>
            <p>12</p>
          </div>
          <div className="text-gray-70 font-rubik text-sm font-normal">
            <p>LP BALANCE</p>
            <p>12</p>
          </div>
          <div className="text-gray-70 font-rubik text-sm font-normal">
            <p>24H VOLUME</p>
            <p>12</p>
          </div>
         */}
        </div>
      )}
      <div className="flex justify-between w-full my-4">
        <div className="w-fit flex gap-x-2 items-center">
          <h5 className="text-sm sm:text-base lg:text-lg text-[#D0F0BF]">{`$${tokenDetails.symbol}`}</h5>
          <div className="bg-[#053738] p-1 rounded-2xl flex gap-x-2 px-3">
            <p className="text-sm sm:text-base lg:text-lg">{shortenAddress(daoInfo?.daoToken || '')}</p>
            <ClickToCopy copyText={daoInfo?.daoToken || ''} className="text-teal-20" />
          </div>
        </div>
        <div className="w-fit flex items-center gap-x-2">
          <a>
            <Image
              src="/assets/link-logo.svg"
              alt={fundDetails.title}
              className="w-4 h-4 sm:w-5 sm:h-5"
              width={24}
              height={24}
              style={{ width: '100%' }}
            />
          </a>
          <a href={telegramDeFAILink} target="_blank" rel="noopener noreferrer">
            <Image
              src="/assets/telegram-icon.svg"
              alt="defai-cartel"
              className="w-4 h-4 sm:w-5 sm:h-5"
              width={24}
              height={24}
              style={{ width: '100%' }}
            />
          </a>
          <a href={twitterDeFAILink} target="_blank" rel="noopener noreferrer">
            <Image
              src="/assets/x.svg"
              alt="defai-cartel"
              className="w-4 h-4 sm:w-5 sm:h-5"
              width={24}
              height={24}
              style={{ width: '100%' }}
            />
          </a>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-y-3 pb-6">
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">{fundDetails.title}</h2>
        <p className=" sm:text-xs lg:text-sm text-left text-[#AEB3B6]">{fundDetails.description}</p>
      </div>
      <div className="w-full">
        <PoolDetailCard
          marketCap={marketData.marketCap || 0}
          liquidity={marketData.liquidity || 0}
          volume={marketData.volume || 0}
        />
      </div>

      {/* 
      <CardContent className="space-y-4 sm:space-y-6">
        <Card className="bg-[#1b1c1d] border-[#27292a] w-full">
          <CardContent className="pt-6">
            <p className=" text-sm sm:text-base md:text-lg lg:text-lg text-left">{props?.description}</p>
          </CardContent>
        </Card>

        <div className="text-left flex flex-row gap-4 sm:gap-6">
          <div className="grid grid-rows-[80%_20%] gap-2 sm:gap-1 w-full">
            <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full h-[max-content]">
              <CardContent className="space-y-1 sm:space-y-2 px-2 sm:px-3 pb-0">
                <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Market Cap</p>
                <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
                  ${commaSeparator(marketCap || 0)}
                </p>
                <p
                  className={`text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold ${
                    tokenChange?.percent < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {`${commaSeparator(Number(tokenChange?.token || 0).toFixed(2))} (${Number(
                    tokenChange?.percent || 0,
                  ).toFixed(2)}%)`}
                </p>
              </CardContent>
            </Card>
            <div className="h-min flex justify-center items-center gap-2 text-[#498ff8] text-sm sm:text-base md:text-xl mt-2">
              <span>{shortenAddress(daoTokenAddress)}</span>
              <Copy
                className="w-4 h-4 sm:w-5 sm:h-5 hover:cursor-pointer"
                onClick={() => handleCopy(props.modeAddress)}
              />
            </div>
          </div>

          <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full">
            <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-3 p-0">
              <div>
                <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Holdings</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                  {Number(daoBalance).toFixed(2)} {props.shortname}{' '}
                  <span className="text-sm sm:text-lg md:text-xl lg:text-2xl"></span>
                </p>
              </div>
              <div>
                <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Market Value</p>
                <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
                  ${(Number(daoBalance) * Number(price)).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent> */}
    </Card>
  );
};

export default FundDetails;
