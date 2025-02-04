import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { handleContribute } from "@/contributeFund"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { getTier } from "@/getterFunctions"
import { useAccount } from "wagmi";
import modeABI from "../../modeABI.json";
const MODE_TOKEN_ADDRESS = "0xDfc7C877a950e49D2610114102175A06C2e3167a";
// import { set } from "date-fns"
// import { EthereumIcon } from "@/assets/icons/ethereum-icon"

export default function BurnCard({ fundingProgess }: { fundingProgess: number }) {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState("");
  const [tier, setTier] = useState("");
  const { isConnected } = useAccount();
  const [isContributing, setIsContributing] = useState(false);

  const fetchBalance = async () => {
    try {
      if (!window.ethereum) {
        console.log("MetaMask is not installed");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Check if an account is connected without triggering a popup.
      const accounts = await provider.listAccounts();
      if (!accounts.length) {
        console.log("No connected accounts found");
        return;
      }

      // Use the connected account
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


  const handleInputChange = (e: any) => {
    console.log("amount is ", e.target.value)
    setAmount(e.target.value);
  }

  const handleContributefunction = async () => {
    
    try {
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
      {fundingProgess < 100 ? (
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
                <p className="text-base sm:text-lg font-medium">Balance: <span className="font-semibold">{balance}</span></p>
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
        <></>
      )}
      <CardContent className="space-y-8 mt-8">
        <div className="space-y-4">
          <h3 className="text-[#409cff] text-xl sm:text-2xl font-semibold">About Token</h3>
          <p className="text-base sm:text-lg">
            Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
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
        </p>
      </CardContent>
    </Card>
  )
}

