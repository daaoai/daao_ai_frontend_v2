import { Copy } from 'lucide-react';
import ModeImage from '/public/assets/mode.png';
import Image from 'next/image';
import { Separator } from '@/shadcn/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { shortenAddress } from '@/utils/address';
import { handleCopy } from '@/utils/copy';

interface InfoRowProps {
  label: string;
  value: string;
  mode?: boolean;
}

const InfoRow = ({ label, value, mode }: InfoRowProps) => {
  return (
    <div className="space-y-1">
      <div className="text-[#aeb3b6] text-left flex justify-between items-center">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-right text-foreground">{mode ? shortenAddress(value) : value}</span>
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

interface OrderbookProps {
  name: string;
  created: string;
  owner: string;
  token: string;
  ethRaised: string;
}

const Orderbook = ({ name, created, owner, token, ethRaised }: OrderbookProps) => {
  return (
    <Card className="w-full max-w-md bg-[#1b1c1d] text-card-foreground mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f7931a]">
          <Image src={ModeImage} alt="Mode Token" layout="fill" objectFit="cover" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="Created" value={created} />
        <InfoRow label="DAO Owner" value={owner} mode />
        <InfoRow label="DAO token" value={token} mode />
        <InfoRow label="Mode raised" value={ethRaised} />
      </CardContent>
    </Card>
  );
};

export default Orderbook;
