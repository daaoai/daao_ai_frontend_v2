import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { handleContribute } from "@/contributeFund"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { getTier,getContractData } from "@/getterFunctions"
import { useAccount } from "wagmi";
import modeABI from "../../modeABI.json";
import Link from "next/link"
import { useToast } from '@/hooks/use-toast';
const MODE_TOKEN_ADDRESS = "0xDfc7C877a950e49D2610114102175A06C2e3167a";



  
// import { set } from "date-fns"
// import { EthereumIcon } from "@/assets/icons/ethereum-icon"

export default function BurnCard(props: UpcomingFundDetailsProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState("");
  const [goalReached,setGoalReached] = useState(false);
  const [tier, setTier] = useState("");
  const { isConnected } = useAccount();
  const [isContributing, setIsContributing] = useState(false);
  const [isWhitelisted, setisWhitelisted] = useState(false);
  const [maxLimit, setMaxLimit] = useState(0);

  const checkFinalisedFundraising = async () => {
    try {
      const data = await getContractData();
      if(data.finalisedFundraising){
        window.location.href = "/app/dashboard/1"
      }
      else{
        toast({
          title: "Fundraising is not finalised yet",
        })
      }
    } catch (error) {
      console.error("Error fetching contract data:", error);
    }
  }

  const fetchBalance = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask is not installed");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (!accounts.length) {
        console.log("No connected accounts found");
        return;
      }

      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const modeContract = new ethers.Contract(MODE_TOKEN_ADDRESS, modeABI, signer);
      const rawBalance = await modeContract.balanceOf(address);
      const decimals = await modeContract.decimals();
      const modeBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const tierr = await getTier();
      setTier(tierr.userTierLabel);
      setBalance(modeBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };
  useEffect(() => {
    if (isConnected) {
      fetchBalance();
    }
  }, [isConnected]);

  useEffect(() => {
    if(isConnected){
      return;
    }
    const fetchContractData = async () => {
      try {
        const data = await getContractData();
        if(data.goalReached && data.finalisedFundraising){
          setGoalReached(true);
        }
        setisWhitelisted(data.iswhitelisted);
        setMaxLimit(data.maxLimit);
        console.log("Data is ", data)
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };

    fetchContractData();
  }
  , [isConnected]);


  const handleInputChange = (e: any) => {
    console.log("amount is ", e.target.value)
    setAmount(e.target.value);
  }

  const handleContributefunction = async () => {

    try {
      if(amount > Number(balance)){
        toast({
          title: "You do not have enough balance to contribute this amount",
        })
        
        return;
      }
      if(!isWhitelisted){
        toast({
          title: "You are not whitelisted to contribute to this fund",
        })
        return;
      }
      if(amount > maxLimit){
        toast({
          title: "You are exceeding the maximum limit for your tier",
        })
        return;
      }
      setIsContributing(true);
      await handleContribute(amount.toString());
      setIsContributing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error contributing to fund:", error);
      setIsContributing(false);
    }
  }

  return (
    <Card className="text-left w-full max-w-3xl bg-[#0d0d0d] border-[#383838] text-white font-['Work Sans']">
      {props.fundingProgress < 100 && !goalReached? (
        <>
          <CardHeader className="space-y-9">
            <div className="flex items-center gap-3">
              <span className="text-[#409cff] text-2xl sm:text-3xl font-semibold">$MODE</span>
              <h2 className="text-2xl sm:text-3xl font-semibold">Contribute</h2>
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
        {/*<div className="grid sm:grid-cols-2 gap-6">
          {['How to Earn', 'Whitelist Mechanics'].map((title) => (
            <div key={title} className="space-y-4">
              <h4 className="text-[#409cff] text-base sm:text-lg font-semibold">{title}</h4>
              <ul className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="text-sm sm:text-base">
                    - Yorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm sm:text-base">
          Porem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>*/}
      </CardContent>
    </Card>
  )
}

