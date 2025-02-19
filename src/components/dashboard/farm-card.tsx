import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign, Wallet } from "lucide-react"
import Link from "next/link"
import { FarmPool } from "@/types/farm"

interface FarmCardProps {
  farm: FarmPool;
}

const FarmCard = ({ farm }: FarmCardProps) => {
  // Calculate start and end times in milliseconds
  const startTimeMs = Number(farm.startTime.toString()) * 1000;
  const endTimeMs = Number(farm.endTime.toString()) * 1000;
  const now = Date.now();
  const isActive = now >= startTimeMs && now <= endTimeMs;

  const name = `Farm Pool (${farm.depositToken.slice(0, 6)}...)`;
  const description = `Active from ${new Date(startTimeMs).toLocaleDateString()} until ${new Date(endTimeMs).toLocaleDateString()}`;
  const apr = `${farm.apr.toFixed(2)}%`;
  const tvl = farm.totalStackedAmount.toString();
  const stakeInfo = `${farm.userInfo.stackedAmount.toString()} tokens staked`;
  const earnInfo = `${farm.unclaimedReward.toString()} pending rewards`;
  const address = farm.poolAddress;

  return (
    <Card className="box-border w-full max-w-[420px] bg-[#0d0d0d] border-[#383838] text-white flex flex-col">
      <CardContent className="p-6 flex flex-col gap-6 flex-grow">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-[50px] flex-shrink-0">
              <div className="absolute left-0 top-0 w-[50px] h-[50px] bg-white rounded-full border border-black" />
              <div className="absolute left-[30px] top-0 w-[50px] h-[50px] bg-white rounded-full border border-black" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-[#aeb3b6] text-sm">{description}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-[#1b1c1d] text-white border-[#383838] self-start sm:self-center"
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex flex-col gap-4 flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">APR</p>
              <p className="text-2xl sm:text-3xl font-semibold">
  {Number(apr).toFixed(6)}
</p>            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">TVL</p>
              <p className="text-2xl sm:text-3xl font-semibold">  {Number(tvl).toFixed(6)}
              </p>
            </div>
          </div>

          <Separator className="bg-[#383838]" />

          <div className="text-left flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Wallet />
              <p className="text-base sm:text-lg">{stakeInfo}</p>
            </div>
            <div className="flex items-center gap-4">
              <DollarSign />
              <p className="text-base sm:text-lg">{earnInfo}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-0">
        <Button
          variant="secondary"
          className="w-full bg-[#27292a] text-white hover:bg-[#323435] rounded-t-none h-14"
          // Optionally disable the button if not active
          disabled={!isActive}
        >
          <Link href={`/app/farm/mode/${address}`} className="text-lg sm:text-xl font-semibold mr-2">
            View Farm
          </Link>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FarmCard;
