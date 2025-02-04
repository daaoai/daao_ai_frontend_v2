import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWalletButton } from "../ui/connect-button"
import { workSans } from "@/lib/fonts"
import { EthereumIcon } from "@/assets/icons/ethereum-icon"
import { ethers } from "ethers";
import poolAbi from "../../poolABI.json"
import router from "../../router.json"
import { FiSettings } from "react-icons/fi"  

const CL_POOL_ROUTER_ADDRESS = "0xC3a15f812901205Fc4406Cd0dC08Fe266bF45a1E"; // Your deployed CLPoolRouter address
const CL_POOL_ADDRESS = "0x7E7985c745F016696e35a92c582c030C69803C01";   

const Buysell = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState(0);
  const amounts = ["0.1", "0.25", "0.5", "1", "5"];
  const [currentSqrtPrice, setCurrentSqrtPrice] = useState<string>("");
  const zeroForOne = activeTab === "buy"; 
  const [slippageOpen, setSlippageOpen] = useState(false)          // toggles the popover/modal
  const [slippageTolerance, setSlippageTolerance] = useState("1")   // store in % (string) for the input, default "1" => 1%


  useEffect(() => {
       fetchSlot0();
  }, []);

   async function fetchSlot0() {
    try {
      if (!window.ethereum) return
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const poolContract = new ethers.Contract(CL_POOL_ADDRESS, poolAbi, provider)
      const [sqrtPriceX96] = await poolContract.slot0()
      setCurrentSqrtPrice(sqrtPriceX96.toString())
    } catch (error) {
      console.error("Error fetching slot0:", error)
    }
  }

  async function simulateSwap(newFromValue: string) {
    try {
      if (!window.ethereum) return
      if (!currentSqrtPrice) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()

      const clPoolRouter = new ethers.Contract(
        CL_POOL_ROUTER_ADDRESS,
        router,
        signer
      )

      const amountSpecified = ethers.utils.parseUnits(newFromValue , 18)

      const minOutput = 0

      if (!currentSqrtPrice) return
      const sqrtPriceBN = ethers.BigNumber.from(currentSqrtPrice)
      let sqrtPriceLimitBN: ethers.BigNumber
      const slippageBps = 1
      if (zeroForOne) {
        sqrtPriceLimitBN = sqrtPriceBN.mul(100 - slippageBps).div(100)
      } else {
        sqrtPriceLimitBN = sqrtPriceBN.mul(100 + slippageBps).div(100)
      }
      // const sqrtPriceLimitX96 = sqrtPriceLimitBN.toString()
      const sqrtPriceLimitX96 = "4295128750"
      const deadline = Math.floor(Date.now() / 1000) + 5 * 60
      const [amount0, amount1, newSqrtPrice] = await clPoolRouter.callStatic.getSwapResult(
        CL_POOL_ADDRESS,
        zeroForOne,
        amountSpecified,
        sqrtPriceLimitX96,
        minOutput,
        deadline
      );

      const outTokens = -(ethers.utils.formatUnits(amount1, 18))

      console.log("Simulated swap output:", outTokens)
      setAmountTo(outTokens)
    } catch (err) {
      console.error("Error simulating swap:", err)
      setAmountTo(0)
    }
  }

  function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAmountFrom(val);

    // If user empties the field, reset the "TO" value
    if (!val) {
      setAmountTo(0);
      return;
    }

    // Otherwise, call simulateSwap to get the dynamic quote
    simulateSwap(val);
  }



  async function handleSwap() {
    try {
      if (!window.ethereum) throw new Error("No Ethereum provider found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const clPoolRouter = new ethers.Contract(CL_POOL_ROUTER_ADDRESS, router, signer);
      const amountSpecified = ethers.utils.parseUnits(amountFrom || "0", "ether");
      console.log("amountSpecified:", amountSpecified.toString());

      const slipDecimal = parseFloat(slippageTolerance) / 100
      console.log("Slippage decimal:", slipDecimal)
      const expectedOutput = parseFloat(amountTo.toString()) || 0
      const minOutputNumber = expectedOutput * (1 - slipDecimal)
      const minOutputBN = ethers.utils.parseUnits(
        minOutputNumber.toFixed(6), // round to 6 decimals or so
        18
      )
      console.log("minOutput:", minOutputBN)


      //deadline
      const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
      console.log("deadline:", deadline);
      if (!currentSqrtPrice) {
        throw new Error("No currentSqrtPrice found. Please ensure slot0 is loaded.");
      }

      const sqrtPriceBN = ethers.BigNumber.from(currentSqrtPrice);
      let sqrtPriceLimitBN: ethers.BigNumber;
      const slippageBps = 1; 

      if (zeroForOne) {
        sqrtPriceLimitBN = sqrtPriceBN.mul(100 - slippageBps).div(100);
      } else {
        sqrtPriceLimitBN = sqrtPriceBN.mul(100 + slippageBps).div(100);
      }
      const sqrtPriceLimitX96 = "4295128750"
      console.log("sqrtPriceLimitX96:", sqrtPriceLimitX96);

      const tx = await clPoolRouter.getSwapResult(
        CL_POOL_ADDRESS,      
        zeroForOne,           
        amountSpecified,      
        sqrtPriceLimitX96,
        minOutputBN,            
        deadline              
      );
      

      const receipt = await tx.wait();
      await fetchSlot0();
      setAmountFrom("");
      setAmountTo(0);
      console.log("Swap successful!", receipt);

    } catch (error) {
      console.error("Error during swap:", error);
    }
  }


  return (
    <Card className="h-full w-full max-w-xl bg-[#0e0e0e] text-white">
      <CardContent className="p-6 space-y-6">

        {/* -- Top Row: Tab ("Buy"/"Sell") + Settings Icon -- */}
        <div className="flex items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "buy" | "sell")}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-2 bg-[#1b1c1d]">
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-white data-[state=active]:text-black w-20"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="data-[state=active]:bg-white data-[state=active]:text-black w-20"
              >
                Sell
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* --- Gear Icon --- */}
          <button
            onClick={() => setSlippageOpen(!slippageOpen)}
            className="p-2 hover:bg-[#1b1c1d] rounded-md"
          >
            <FiSettings size={20} />
          </button>
        </div>

        {/* --- SLIPPAGE POPOVER / SETTINGS --- */}
        {slippageOpen && (
          <div className="border p-3 bg-[#1b1c1d] rounded-md">
            <label className="block text-sm text-[#aeb3b6] mb-1">
              Slippage Tolerance (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={slippageTolerance}
                onChange={(e) => setSlippageTolerance(e.target.value)}
                className="p-1 bg-transparent border border-[#242626] rounded text-white w-20"
                step="0.1"
              />
              <span className="text-[#aeb3b6]">%</span>
            </div>
          </div>
        )}

        {/* FROM Input */}
        <Card className="bg-[#1b1c1d] border-0">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-left text-[#aeb3b6] text-sm">FROM</p>
              <input
                type="number"
                placeholder="0"
                value={amountFrom}
                onChange={handleFromChange}
                className={`appearance-none bg-transparent border-0 p-0 text-3xl w-24 focus-visible:ring-0 focus-visible:ring-offset-0 ${workSans.className}`}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between">
                <span className="text-[#aeb3b6]">Balance: ?</span>
                <Button
                  variant="link"
                  className="text-[#39db83] p-0 h-auto font-normal"
                  onClick={() => setAmountFrom("1")}
                >
                  MAX
                </Button>
              </div>
              <Button
                variant="outline"
                className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white"
              >
                <EthereumIcon className="mr-2 h-4 w-4" />
                {zeroForOne ? "MODE" : "DAO"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TO Input */}
        <Card className="bg-[#1b1c1d] border-0">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-left text-[#aeb3b6] text-sm">TO</p>
              <input
                type="number"
                placeholder="0"
                value={amountTo}
                onChange={(e) => setAmountTo(e.target.value)}
                className={`appearance-none bg-transparent border-0 p-0 text-3xl w-24 focus-visible:ring-0 focus-visible:ring-offset-0 ${workSans.className}`}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between">
                <span className="text-[#aeb3b6]">Balance: ?</span>
                <Button variant="link" className="text-[#39db83] p-0 h-auto font-normal">
                  MAX
                </Button>
              </div>
              <Button
                variant="outline"
                className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white"
              >
                <EthereumIcon className="mr-2 h-4 w-4" />
                {zeroForOne ? "DAO" : "MODE"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display slot0 sqrt price */}
        <div className="text-sm">
          <p className="text-[#aeb3b6] mb-1">Current Sqrt Ratio (slot0):</p>
          <p className="text-white">
            {currentSqrtPrice ? currentSqrtPrice : "Loading..."}
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-left space-y-1">
            <p className="text-[#aeb3b6]">Price Impact</p>
            <p className="text-[#aeb3b6]">Exchange</p>
          </div>
          <div className="space-y-1 text-right">
            <p>0.00%</p>
            <p className="text-2xl">-</p>
          </div>
        </div>

        <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={handleSwap}>
          Swap
        </Button>
      </CardContent>
    </Card>
  )

}

function ExchangeInput({ label }: { label: string }) {
  return (
    <Card className="bg-[#1b1c1d] border-0">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-left text-[#aeb3b6] text-sm">{label}</p>
          <input
            type="number"
            placeholder="0"
            className={`appearance-none bg-transparent border-0 p-0 text-3xl w-24 focus-visible:ring-0 focus-visible:ring-offset-0 ${workSans.className}`}
          />
        </div>
        <div className="space-y-2 text-right">
          <div className="text-sm flex flex-row justify-between">
            <span className="text-[#aeb3b6]">0 ETH</span>
            <Button
              variant="link"
              className="text-[#39db83] p-0 h-auto font-normal"
            >
              MAX
            </Button>
          </div>
          <Button
            variant="outline"
            className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white"
          >
            <EthereumIcon className="mr-2 h-4 w-4" />
            ETH
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Buysell;
