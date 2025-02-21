import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Wallet } from "lucide-react";
import Link from "next/link";
import { FarmPool } from "@/types/farm";
import { abbreviateNumber } from "@/utils/numbers";
import { formatUnits } from "viem";
import Image from "next/image";
import { CURRENT_DAO_IMAGE, GAMBLE_IMAGE } from "@/lib/links";

interface FarmCardProps {
  farm: FarmPool;
}

const FarmCard = ({ farm }: FarmCardProps) => {
  const startTimeMs = Number(farm.startTime.toString()) * 1000;
  const endTimeMs = Number(farm.endTime.toString()) * 1000;
  const now = Date.now();
  const isActive = now >= startTimeMs && now <= endTimeMs;

  const name = `Farm Pool (${farm.depositToken.slice(0, 6)}...)`;
  const description = `Active from ${new Date(startTimeMs)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(" ", "/")} until ${new Date(endTimeMs)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(" ", "/")}`;
  const apr = `${farm.apr.toFixed(2)}%`;
  const tvl = farm.totalStackedUSD;
  const stakeInfo = `${formatUnits(farm.userInfo.stackedAmount, 18)}`;
  const earnInfo = `${formatUnits(farm.unclaimedReward, 18)}`;
  const address = farm.poolAddress;

  return (
    <Card className="box-border w-full max-w-[420x] bg-[#0d0d0d] border-[#383838] text-white flex flex-col">
      <CardContent className="p-6 flex flex-col gap-6 flex-grow">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-[50px] flex-shrink-0">
              <Image
                src={GAMBLE_IMAGE}
                alt={"Gambl Token"}
                width={16}
                height={16}
                className="absolute left-0 top-0 w-[50px] h-[50px] rounded-full"
              />
              <Image
                src={CURRENT_DAO_IMAGE}
                alt={"DAO Token"}
                width={16}
                height={16}
                className="absolute left-[30px] top-0 w-[50px] h-[50px] rounded-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-[#aeb3b6] text-sm">{description}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`flex items-center gap-2 px-3 py-1 rounded-md 
    ${isActive ? "bg-green-400 text-white" : "bg-red-400 text-white"}
  `}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full 
      ${isActive ? "bg-green-600" : "bg-red-600"}
    `}
            />
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex flex-col gap-4 flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">APR</p>
              <p className="text-2xl sm:text-3xl font-semibold">{apr}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium">TVL</p>
              <p className="text-2xl sm:text-3xl font-semibold">
                $ {Number(abbreviateNumber(tvl))}
              </p>
            </div>
          </div>
          <Separator className="bg-[#383838]" />
          <div className="text-left flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Wallet />
              <p className="text-base sm:text-lg">
                User Staked Amount : {stakeInfo} CARTEL
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-base sm:text-lg">
                Remaining Rewards : {parseFloat(earnInfo).toFixed(2)} GAMBL
              </p>
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
          <Link
            href={`/app/farm/mode/${address}`}
            className="text-lg sm:text-xl font-semibold mr-2"
          >
            View Farm
          </Link>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FarmCard;
