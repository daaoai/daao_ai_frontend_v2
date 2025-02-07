import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { handleContribute } from "@/contributeFund"
import { useEffect, useState } from "react"
import { useToast } from '@/hooks/use-toast';
import { useAccount, useReadContracts } from 'wagmi'
import contractABI from "../../abi.json";
// import { useFetchBalance } from "./fetchBalance"
import { useFundContext } from "./FundContext";
import { workSans } from "@/lib/fonts"



const wagmiDaoContract = {
  address: "0x0e0cfb2B5d4564B5bf8458782033090ef730a8cB",
  abi: contractABI

} as const;


export default function BurnCard(props: UpcomingFundDetailsProps) {
  const { toast } = useToast();
  const { fetchedData, refreshData, updateTotalContributed } = useFundContext();
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState("");
  const [goalReached, setGoalReached] = useState(false);
  const [tier, setTier] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [isWhitelisted, setisWhitelisted] = useState(false);
  const [maxLimit, setMaxLimit] = useState(0);
  const [fundraisingFinalized, setFundraisingFinalized] = useState(false);

  useEffect(() => {
    if (fetchedData) {
      if (balance === "" || tier === "" || isWhitelisted === false || maxLimit === 0) {
        setBalance(fetchedData.balance);
        setTier(fetchedData.userTierLabel);
        setisWhitelisted(fetchedData.isWhitelisted);
        setMaxLimit(fetchedData.maxLimit);
      }
      if (fetchedData.goalReached) {
        setGoalReached(true);
      };
      console.log("Balance is ", balance);
    }
  }, [fetchedData]);

  const { data, error, refetch } = useReadContracts({
    contracts: [
      {
        ...wagmiDaoContract,
        functionName: "fundraisingFinalized",
      }
    ],
  })

  if (data && typeof data[0]?.result === "boolean" && data[0]?.result !== fundraisingFinalized) {
    setFundraisingFinalized(data[0]?.result);
  }

  const checkFinalisedFundraising = async () => {
    await refetch();
    if (fundraisingFinalized) {
      window.location.href = "/app/dashboard/1";
    } else {
      toast({
        title: "Fundraising is not finalised yet",
        variant: "destructive",
        className: `${workSans.className}`
      });
    }
  };


  const handleInputChange = (e: any) => {
    console.log("amount is ", e.target.value)
    setAmount(e.target.value);
  }

  const handleContributefunction = async () => {
    try {
      if (amount > Number(balance)) {
        toast({
          title: "You do not have enough balance to contribute this amount",
          variant: "destructive",
          className: `${workSans.className}`
        })

        return;
      }
      if (!isWhitelisted) {
        toast({
          title: "You are not whitelisted to contribute to this fund",
          variant: "destructive",
          className: `${workSans.className}`
        })
        return;
      }
      setIsContributing(true);

      const tx = await handleContribute(amount.toString());
      if (tx === 0) {
        toast({
          title: "Amount exceeds tier limit",
          variant: "destructive",
          className: `${workSans.className}`
        });
        setIsContributing(false);
        return;
      }

      setIsContributing(false);
      toast({
        title: "Successfully contributed to the fund",
        className: `${workSans.className} bg-[#2ca585]`
      });
      await refreshData();
      setBalance((prev) => (Number(prev) - Number(amount)).toFixed(3));
      updateTotalContributed(amount);
    } catch (error) {
      console.error("Error contributing to fund:", error);
      setIsContributing(false);
    }
  }

  return (
    <Card className="text-left w-full max-w-3xl bg-[#0d0d0d] border-[#383838] text-white font-['Work Sans']">
      {props.fundingProgress < 100 && !goalReached ? (
        <>
          <CardHeader className="space-y-9">
            <div className="flex items-center gap-3">
              <span className="text-[#409cff] text-2xl sm:text-3xl font-semibold">Whitelist</span>
              <h2 className="text-2xl sm:text-3xl font-semibold">Allocation</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-black rounded border border-[#383838]">
                <Input
                  type="number"
                  placeholder="0"
                  className="appearance-none bg-transparent border-none text-[#e4e6e7] text-lg sm:text-xl font-medium w-full focus:outline-none"
                  value={amount}
                  onChange={handleInputChange}
                />
                <span className="text-[#e4e6e7] text-sm sm:text-base font-medium">MAX</span>
              </div>
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-medium">Balance: <span className="font-semibold">{Number(balance).toFixed(3)}</span></p>
                <p className="text-base sm:text-lg font-medium">Tier: <span className="font-semibold">{tier}</span></p>
                <Button
                  variant="outline"
                  className="w-full h-12 bg-white text-black text-lg sm:text-xl font-semibold hover:bg-white/80 hover:text-black/90"
                  onClick={handleContributefunction}
                  disabled={isContributing || amount <= 0}
                >
                  {isContributing ? "Contributing..." : "Contribute"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator className="bg-[#383838]" />
        </>
      ) : (
        <>
          <div className="space-y-10">
            <h3 className="text-[#409cff] text-2xl sm:text-2xl font-semibold mt-7 mx-4 my-6">
              Goal Has Been Reached

            </h3>


            <Button

              className="bg-[#409cff] text-white text-lg sm:text-xl font-semibold hover:bg-[#307bcc] w-100 mx-8"
              onClick={checkFinalisedFundraising}
            >

              Go to Token Dashboard
            </Button>

          </div>
        </>
      )}
      <CardContent className="space-y-8 mt-8">
        <div className="space-y-4">

          <h3 className="text-[#409cff] text-xl sm:text-2xl font-semibold">
            About Token
          </h3>
          <div className="text-base sm:text-lg">
            {
              props.aboutToken.trim()
                .split("\n")
                .map((paragraph, index) => (
                  <p key={index} className="text-base sm:text-lg">
                    {paragraph}
                    <br />
                  </p>
                ))
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

