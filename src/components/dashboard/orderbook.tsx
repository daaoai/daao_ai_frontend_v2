import { Copy } from 'lucide-react';
import ModeImage from '/public/assets/mode.png';
import Image from 'next/image';
import { Separator } from '@/shadcn/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { shortenAddress } from '@/utils/address';
import { handleCopy } from '@/utils/copy';
import { DaoInfo, FundDetails } from '@/types/daao';
import { formatUnits } from 'viem';

interface InfoRowProps {
  label: string;
  value: string;
  mode?: boolean;
}

const InfoRow = ({ label, value, mode }: InfoRowProps) => {
  return (
    <div className="space-y-1">
      <div
        className="text-[#aeb3b6] w-full text-left flex justify-between items-center bg-black border-b border-gray-20
         shadow-md pb-2"
      >
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {value && (
            <span className="text-right text-lightYellow text-foreground">{mode ? shortenAddress(value) : value}</span>
          )}
          {mode && (
            <Copy
              className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => handleCopy(value)}
            />
          )}
        </div>
      </div>
      <Separator />
    </div>
  );
};

const Orderbook = ({ daaoInfo, fundDetails }: { daaoInfo: DaoInfo | null; fundDetails: FundDetails }) => {
  return (
    <Card className="w-full max-w-md mx-auto border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-lg text-white font-semibold flex flex-col gap-2 items-start">
          <p className="text-teal-40 text-lg font-normal">{fundDetails.title}</p>
          <p className="text-teal-20 text-sm font-normal">{daaoInfo?.daoTokenDetails.symbol}</p>
        </div>
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f7931a]">
          <Image src={daaoInfo?.daoTokenDetails.logo || '/assets/fallbackToken.svg'} alt="Mode Token" layout="fill" objectFit="cover" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow
          label="Fund Expiry"
          value={new Date(Number(daaoInfo?.fundraisingDeadline)).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        />
        <InfoRow label="DAO Owner" value={daaoInfo?.owner || ''} mode />
        <InfoRow label="DAO token" value={daaoInfo?.daoToken || ''} mode />
        <InfoRow
          label={`${daaoInfo?.daoTokenDetails?.symbol} Raised`}
          value={formatUnits(daaoInfo?.totalRaised || BigInt(0), daaoInfo?.daoTokenDetails.decimals || 18)}
        />
      </CardContent>
    </Card>
  );
};

export default Orderbook;
