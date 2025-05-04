import { chainIdToChainSlugMap } from '@/constants/chains';
import { lpFarmAddressesByChainId } from '@/constants/farm';
import { tokenImageLinks } from '@/constants/links';
import { Badge } from '@/shadcn/components/ui/badge';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { LPFarm } from '@/types/farm';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import FallbackTokenLogo from '/public/assets/fallbackToken.svg';

interface LPFarmCardProps {
  lpFarm: LPFarm;
  chainId: number;
  isLoading: boolean;
}

const LPFarmCard = ({ lpFarm, chainId }: LPFarmCardProps) => {
  const { token0Details, token1Details } = lpFarm;
  const { startTime, endTime } = lpFarmAddressesByChainId[chainId][lpFarm.address];

  const { address: account } = useAccount();

  const startTimeMs = Number(startTime.toString()) * 1000;
  const endTimeMs = Number(endTime.toString()) * 1000;
  const now = Date.now();
  const isActive = now >= startTimeMs && now <= endTimeMs;

  const formatDate = (timestamp: number) =>
    new Date(timestamp)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .replace(' ', '/');

  return (
    <Card className="box-border w-full max-w-[360px] bg-[#0d0d0d] border-[#383838] text-white flex flex-col">
      <CardContent className="p-6 flex flex-col gap-6 flex-grow">
        <div className="flex  gap-4 justify-between items-start">
          <div className="flex flex-col md:flex-row items-start gap-3">
            <div className="relative w-20 h-[50px] flex-shrink-0">
              <Image
                src={
                  tokenImageLinks[token0Details.symbol.toUpperCase() as keyof typeof tokenImageLinks] ||
                  token0Details.logo ||
                  FallbackTokenLogo
                }
                alt="Reward Token"
                width={16}
                height={16}
                className="absolute left-0 top-0 w-[50px] h-[50px] rounded-full"
              />
              <Image
                src={
                  tokenImageLinks[token1Details.symbol.toUpperCase() as keyof typeof tokenImageLinks] ||
                  token1Details.logo ||
                  FallbackTokenLogo
                }
                alt="Deposit Token"
                width={16}
                height={16}
                className="absolute left-[30px] top-0 w-[50px] h-[50px] rounded-full"
              />
            </div>
            <div className="flex items-start gap-1">
              <h2 className="text-md font-bold">${token0Details.symbol}</h2>
              <h2 className="text-md font-bold">${token1Details.symbol}</h2>

              {/* <p className="text-gray-70 text-sm">{description}</p> */}
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`flex items-center gap-2 px-3 py-1 rounded-md font-rubik font-regular ${
              isActive ? 'bg-teal-20 text-black' : 'bg-red-400 text-black'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* <div className="flex flex-col gap-4 flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1 items-start">
              <p className="text-lg font-normal text-midGreen font-sora">APR</p>
              <p className="text-2xl font-medium font-rubik">{0}</p>
            </div>
            <div className="flex flex-col gap-1 items-start">
              <p className="text-lg font-normal text-midGreen font-sora">TVL</p>
              <p className="text-2xl font-medium font-rubik">$ {0}</p>
            </div>
          </div>
          <Separator className="bg-[#383838]" />
          <div className="text-left flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Wallet className="text-midGreen" width={18} height={18} />
              <p className="text-sm text-midGreen font-rubik">
                Total Staked ${token0Details.symbol} : {abbreviateNumber(Number(0))} {token0Details.symbol}
              </p>
            </div>
          </div>
        </div> */}
      </CardContent>
      <Link
        href={`/${chainIdToChainSlugMap[chainId]}/lp-farms/${lpFarm.address}`}
        className="text-lg text-black sm:text-xl py-2 font-sora font-semibold bg-teal-50 mt-2 mx-6 rounded-md active:scale-95 transition-transform ease-in-out duration-150"
        onClick={(e) => {
          if (!account) {
            e.preventDefault();
            toast.error('Please connect your wallet to view the farm details.');
            return;
          }
        }}
      >
        View
      </Link>
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-black rotate-[320deg]" />
    </Card>
  );
};

export default LPFarmCard;
