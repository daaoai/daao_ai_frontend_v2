import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bitcoin, Copy } from 'lucide-react'
import ModeImage from '../../assets/icons/mode.png'
import Image from 'next/image';
import { handleCopy, shortenAddress } from "@/lib/utils";

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
  )
}

const Orderbook = ({
  name,
  created,
  owner,
  token,
  tradingEnds,
  ethRaised,
}: OrderbookProps) => {
  return (
    <Card className="w-full max-w-md bg-[#1b1c1d] text-card-foreground mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f7931a]">
          <Image
            src={ModeImage}
            alt="Mode Token"
            layout="fill" // This ensures the image fills the parent container
            objectFit="cover" // This ensures the image covers the entire container while maintaining aspect ratio
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="Created" value={created} />
        <InfoRow
          label="DAO Owner"
          value={owner}
          mode
        />
        <InfoRow
          label="DAO token"
          value={token}
          mode
        />
        <InfoRow label="Trading ends" value={tradingEnds} />
        <InfoRow label="Mode raised" value={ethRaised} />
      </CardContent>
    </Card>
  )
}

export default Orderbook;
