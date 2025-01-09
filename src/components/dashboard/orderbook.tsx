import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bitcoin, Copy } from 'lucide-react'

interface InfoRowProps {
  label: string
  value: string
  mode?: boolean
}

const InfoRow = ({ label, value, mode }: InfoRowProps) => (
  <div className="space-y-1">
    <div className="text-[#aeb3b6] text-left flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-right text-foreground">{value}</span>
        {mode && (
          <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        )}
      </div>
    </div>
    <Separator />
  </div>
)

interface OrderbookProps {
  name: string
  created: string
  owner: string
  treasury: string
  token: string
  tradingEnds: string
  ethRaised: string
}

const Orderbook = ({
  name,
  created,
  owner,
  treasury,
  token,
  tradingEnds,
  ethRaised,
}: OrderbookProps) => {
  return (
    <Card className="w-full max-w-md bg-[#1b1c1d] text-card-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f7931a]">
          <Bitcoin className="overflow-visible h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
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
          label="Treasury address"
          value={treasury}
          mode
        />
        <InfoRow
          label="DAO token"
          value={token}
          mode
        />
        <InfoRow label="Trading ends" value={tradingEnds} />
        <InfoRow label="ETH raised" value={ethRaised} />
      </CardContent>
    </Card>
  )
}

export default Orderbook;
