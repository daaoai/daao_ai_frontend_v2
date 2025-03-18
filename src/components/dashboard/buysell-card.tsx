import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ConnectWalletButton } from "../ui/connect-button"
import { workSans } from "@/lib/fonts";
import QUOTER_ABI from "@/lib/abis/quoterAbi.json";
// import { EthereumIcon } from "@/assets/icons/ethereum-icon"
import { ethers } from "ethers";
import poolAbi from "../../poolABI.json";
import router from "../../router.json";
import modeABI from "../../modeABI.json";
import { FiSettings } from "react-icons/fi";
import ModeTokenLogo from "../../assets/icons/mode.png";
import Image from "next/image";
import daoABI from "../../DaoABI.json";
import { CURRENT_DAO_IMAGE, FUND_CARD_PLACEHOLDER_IMAGE } from "@/lib/links";
// import {getContractData} from "../../getterFunctions"
import velodromeFactoryABI from "../../veloABI.json";
import swapRouter from "../../swapSimulateABI.json";
import { useToast } from "@/hooks/use-toast";
// import { parseAbi } from 'viem'
import {
  useAccount,
  useReadContracts,
  usePublicClient,
  useWalletClient,
} from "wagmi";
// import contractABI from "../../abi.json";
import { useFetchBalance } from "./fetchBalance";
import { set } from "date-fns";
// import { fetchData } from "next-auth/client/_utils"
import { useFundContext } from "./FundContext";
import { quoterAddress, SWAP_ROUTER_ADDRESS } from "@/common/common";
import {
  createPublicClient,
  Hex,
  http,
  parseUnits,
  formatUnits,
  WalletClient,
  erc20Abi,
  maxUint256,
  type Address,
} from "viem";
import { scroll } from "viem/chains"; // or whatever chain you're using
import { numberToString } from "@/utils/number";

const TICK_SPACING = 10000;
const VELODROME_FACTORY_ADDRESS = "0x46B3fDF7b5CDe91Ac049936bF0bDb12c5d22202e";
// const CL_POOL_ROUTER_ADDRESS = "0xC3a15f812901205Fc4406Cd0dC08Fe266bF45a1E";
const MODE_TOKEN_ADDRESS = "0xd29687c813D741E2F938F4aC377128810E217b1b"; // 0xd29687c813D741E2F938F4aC377128810E217b1b

// Create the public client outside the component (could be in a separate config file)
const publicClient = createPublicClient({
  chain: scroll,
  transport: http(),
});

const Buysell = () => {
  const { toast } = useToast();
  const account = useAccount();
  const publicClients = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState(0);
  const [firstTokenMode, setFirstTokenMode] = useState(false);
  const [currentSqrtPrice, setCurrentSqrtPrice] = useState<string>("");
  const [slippageOpen, setSlippageOpen] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState("1");
  const [isSwapping, setIsSwapping] = useState(false);
  const [modeBalance, setModeBalance] = useState("0");
  const [daoTokenAddress, setDaoTokenAddress] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  // const [fetcher, setFetcher] = useState(false);
  const { daoBalance, setDaoBalance } = useFundContext();

  const accountAddress = account.address as `0x${string}`;
  const { data: fetchedData, refreshData } = useFetchBalance(accountAddress);

  console.log(fetchedData, "lkjhgfdcvbhjiuytgfb");

  const { data: daoReadData, refetch } = useReadContracts({
    contracts: daoTokenAddress
      ? [
          {
            address: daoTokenAddress as `0x${string}`,
            abi: daoABI,
            functionName: "balanceOf",
            args: [accountAddress],
          },
        ]
      : [],
  });

  useEffect(() => {
    console.log("daoToken is", fetchedData?.daoToken);
    if (!fetchedData) return;
    if (!daoTokenAddress) {
      setDaoTokenAddress(fetchedData?.daoToken);
    }
    setModeBalance(fetchedData.balance);
  }, [fetchedData, daoTokenAddress, activeTab]);

  useEffect(() => {
    if (daoReadData && daoReadData[0]?.result) {
      const rawBal = daoReadData[0].result as bigint;
      const formatted = ethers.utils.formatUnits(rawBal, 18);
      setDaoBalance(formatted);
    }
  }, [daoReadData, setDaoBalance, activeTab]);

  useEffect(() => {
    const fetchPoolAddress = async () => {
      if (!daoTokenAddress) return;

      try {
        console.log("Attempting to get pool for:", {
          token1: MODE_TOKEN_ADDRESS,
          token2: daoTokenAddress,
          tickSpacing: TICK_SPACING,
        });

        const pool = (await publicClient.readContract({
          address: VELODROME_FACTORY_ADDRESS,
          abi: velodromeFactoryABI,
          functionName: "getPool",
          args: [MODE_TOKEN_ADDRESS, daoTokenAddress, TICK_SPACING],
        })) as Hex;

        console.log("Pool:", pool);

        if (pool) {
          setPoolAddress(pool);
          console.log("Pool Address:", pool);
        } else {
          console.log("Pool does not exist for these tokens.");
          setPoolAddress("");
        }
      } catch (error) {
        setPoolAddress("");
      }
    };

    fetchPoolAddress();
  }, [daoTokenAddress]);

  useEffect(() => {
    if (!poolAddress) return;
    fetchPoolTokens();
    fetchSlot0();
    fetchBalances();
    setAmountFrom("");
    setAmountTo(0);
  }, [activeTab, poolAddress]);

  async function fetchSlot0() {
    if (!poolAddress) return;
    if (!window.ethereum) return;
    try {
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
      // const [sqrtPriceX96] = await poolContract.slot0();
      setCurrentSqrtPrice(
        zeroForOne === false
          ? "4295128750"
          : "1461446703485210103287273052203988822378723970300"
      );
    } catch (error) {
      console.error("Error fetching slot0:", error);
    }
  }

  async function fetchPoolTokens() {
    if (!poolAddress) return;

    try {
      // Read token0
      const token0 = await publicClient.readContract({
        address: poolAddress as Address,
        abi: poolAbi,
        functionName: "token0",
      });

      // Read token1
      const token1 = await publicClient.readContract({
        address: poolAddress as Address,
        abi: poolAbi,
        functionName: "token1",
      });

      console.log("token0:", token0);
      console.log("token1:", token1);

      // Check which token is MODE
      if (token0 === MODE_TOKEN_ADDRESS) {
        setFirstTokenMode(true);
      } else if (token1 === MODE_TOKEN_ADDRESS) {
        setFirstTokenMode(false);
      }
    } catch (error) {
      console.error("Error fetching pool tokens:", error);
    }
  }

  async function fetchBalances() {
    if (!window.ethereum) return;
    if (activeTab === "buy") {
    } else {
      setModeBalance("0");
    }
  }

  function computeZeroForOne() {
    console.log(firstTokenMode, "---- firstTokenMode");
    if (firstTokenMode === null) {
      return false;
    }
    if (firstTokenMode) {
      return activeTab === "buy" ? true : false;
    } else {
      return activeTab === "buy" ? false : true;
    }
  }

  const zeroForOne = computeZeroForOne();

  console.log(zeroForOne, "---- zeroForOne");

  async function simulateSwap(newFromValue: string) {
    console.log(poolAddress, "poolAddress");
    console.log(currentSqrtPrice, "currentSqrtPrice");
    console.log(modeBalance, "modeBalancemodeBalance");
    console.log(newFromValue, "newFromValuenewFromValue");

    if (!poolAddress || !currentSqrtPrice) return;

    try {
      // Balance checks
      if (activeTab === "buy") {
        if (Number(modeBalance) < Number(newFromValue)) {
          toast({
            title: "Insufficient balance",
            variant: "destructive",
            className: `${workSans.className}`,
          });
          setAmountTo(0);
          return;
        }
      }
      if (activeTab === "sell") {
        if (Number(daoBalance) < Number(newFromValue)) {
          toast({
            title: "Insufficient balance",
            variant: "destructive",
            className: `${workSans.className}`,
          });
          setAmountTo(0);
          return;
        }
      }

      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      const amountSpecified = parseUnits(newFromValue, 18);

      // Convert sqrtPrice calculations to bigint
      const sqrtPriceBN = BigInt(currentSqrtPrice);
      let sqrtPriceLimitBN: bigint;
      const slippageBps = BigInt(1);

      if (zeroForOne) {
        sqrtPriceLimitBN =
          (sqrtPriceBN * (BigInt(100) - slippageBps)) / BigInt(100);
      } else {
        sqrtPriceLimitBN =
          (sqrtPriceBN * (BigInt(100) + slippageBps)) / BigInt(100);
      }

      console.log("sqrtPriceLimitBN:", currentSqrtPrice);
      console.log("zeroForOne:", zeroForOne);

      const sqrtPriceLimitX96 = currentSqrtPrice;
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 5 * 60);

      if (!publicClients) return;
      // Simulate the swap using public client
      const { result: amount1 } = await publicClients.simulateContract({
        address: quoterAddress,
        abi: QUOTER_ABI,
        functionName: "quoteExactInputSingle",
        args: [
          poolAddress,
          zeroForOne,
          amountSpecified,
          BigInt(sqrtPriceLimitX96),
        ],
      });

      console.log(amount1, "amount1");

      // Convert negative values to positive
      const outBnAbs = amount1 < BigInt(0) ? -amount1 : amount1;
      const outTokens = formatUnits(BigInt(outBnAbs), 18);

      console.log("Simulated swap output:", outTokens);
      setAmountTo(parseFloat(outTokens));
    } catch (err) {
      console.error("Error simulating swap:", err);
      setAmountTo(0);
    }
  }

  function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setAmountFrom(val);
    if (!val) {
      setAmountTo(0);
      return;
    }
    simulateSwap(val);
  }

  async function handleSwap() {
    try {
      setIsSwapping(true);

      if (!account.address || !walletClient) {
        toast({
          title: "Please connect your wallet",
          variant: "destructive",
          className: `${workSans.className}`,
        });
        return;
      }

      // Input validation
      if (!amountFrom) {
        toast({
          title: "No amount specified",
          variant: "destructive",
          className: `${workSans.className}`,
        });
        return;
      }

      if (amountFrom === "0") {
        toast({
          title: "Amount must be greater than 0",
          variant: "destructive",
          className: `${workSans.className}`,
        });
        return;
      }

      // Balance checks
      if (activeTab === "buy" && Number(modeBalance) < Number(amountFrom)) {
        toast({
          title: "Insufficient balance",
          variant: "destructive",
          className: `${workSans.className}`,
        });
        return;
      }

      if (activeTab === "sell" && Number(daoBalance) < Number(amountFrom)) {
        toast({
          title: "Insufficient balance",
          variant: "destructive",
          className: `${workSans.className}`,
        });
        return;
      }

      // Handle approvals
      if (activeTab === "sell") {
        await checkAndApproveDAO(walletClient);
      } else if (activeTab === "buy") {
        await checkAndApproveMODE(walletClient);
      }

      const amountSpecified = parseUnits(amountFrom || "0", 18);
      const slipDecimal = parseFloat(slippageTolerance) / 100;
      const minOutputNumber = amountTo * (1 - slipDecimal);
      const minOutputBN = parseUnits(minOutputNumber.toFixed(6), 18);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5);
      const sqrtPriceLimitX96 = BigInt(currentSqrtPrice);

      console.log({
        input: [
          poolAddress,
          zeroForOne,
          Number(amountSpecified),
          sqrtPriceLimitX96,
          minOutputBN,
          deadline,
        ],
      });

      // Execute swap using writeContract
      const hash = await walletClient.writeContract({
        address: SWAP_ROUTER_ADDRESS,
        abi: router,
        functionName: "getSwapResult",
        args: [
          poolAddress,
          zeroForOne,
          Number(amountSpecified),
          sqrtPriceLimitX96,
          minOutputBN,
          deadline,
        ],
      });

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Swap successful!", receipt);

      await fetchSlot0();
      setAmountFrom("");
      setAmountTo(0);
      toast({
        title: "Successfull",
        variant: "default",
        className: `${workSans.className}`,
      });
    } catch (error) {
      console.error("Error during swap:", error);
    } finally {
      // Update balances
      if (activeTab === "buy") {
        setModeBalance((prev) =>
          (Number(prev) - Number(amountFrom)).toString()
        );
        setDaoBalance((prev) => (Number(prev) + Number(amountTo)).toString());
      } else {
        setDaoBalance((prev) => (Number(prev) - Number(amountFrom)).toString());
        setModeBalance((prev) => (Number(prev) + Number(amountTo)).toString());
      }

      refetch();
      refreshData();
      setIsSwapping(false);
      setAmountFrom("");
      setAmountTo(0);
    }
  }

  // Update approval functions
  async function checkAndApproveDAO(walletClient: WalletClient) {
    const hash = await walletClient.writeContract({
      chain: scroll,
      account: account.address!,
      address: daoTokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [SWAP_ROUTER_ADDRESS, maxUint256],
    });

    await publicClient.waitForTransactionReceipt({ hash });
  }

  async function checkAndApproveMODE(walletClient: WalletClient) {
    const hash = await walletClient.writeContract({
      chain: scroll,
      account: account.address!,
      address: MODE_TOKEN_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [SWAP_ROUTER_ADDRESS, maxUint256],
    });

    await publicClient.waitForTransactionReceipt({ hash });
  }

  const fromLabel = activeTab === "buy" ? "SCROLL" : "CARTEL";
  const toLabel = activeTab === "buy" ? "CARTEL" : "SCROLL";

  return (
    <Card className="h-full w-full max-w-xl bg-[#0e0e0e] text-white">
      <CardContent className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "buy" | "sell")}
            className="w-full h-12"
          >
            <TabsList className="grid grid-cols-2 bg-[#1b1c1d] h-12">
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white w-full data-[state=active]:h-10 lg:text-xl md:text-lg sm:text-md"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-white w-full data-[state=active]:h-10  lg:text-xl md:text-lg sm:text-md"
              >
                Sell
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <button
            onClick={() => setSlippageOpen(!slippageOpen)}
            className="p-2 hover:bg-[#1b1c1d] rounded-md"
          >
            <FiSettings size={20} />
          </button>
        </div>

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
                className="p-1 bg-transparent border  border-[#242626] rounded text-white !w-28"
                step="0.1"
              />
              <span className="text-[#aeb3b6]">%</span>
            </div>
          </div>
        )}

        <Card className="bg-[#1b1c1d] border-0">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="!w-28">
              <p className="text-left text-[#aeb3b6] text-sm">FROM</p>
              <input
                type="number"
                placeholder="0"
                value={amountFrom}
                onChange={handleFromChange}
                className={`appearance-none bg-transparent border-0 p-0 text-3xl !w-28 f${workSans.className} focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `}
                style={{
                  minWidth: "140px", // Set a reasonable minimum width
                  width: `${amountTo.toString().length + 2}ch`, // Dynamically adjust width
                  height: "3.5rem",
                }}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between">
                <span className="text-[#aeb3b6]">
                  Balance:{" "}
                  {activeTab === "buy"
                    ? Number(modeBalance).toFixed(3)
                    : Number(daoBalance).toFixed(3)}
                </span>
                {/* <Button
                  variant="link"
                  className="text-[#39db83] p-0 h-auto font-normal"
                  onClick={() => {
                    setAmountFrom("1")
                    simulateSwap("1")
                  }}
                >
                  MAX
                </Button> */}
              </div>
              <Button
                variant="outline"
                className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white"
              >
                <Image
                  src={
                    activeTab === "buy"
                      ? "https://scrollscan.com/assets/generic/html/favicon-light.ico"
                      : CURRENT_DAO_IMAGE
                  }
                  alt={activeTab === "buy" ? "SCROLL Token" : "DAO Token"}
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {fromLabel}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1b1c1d] border-0">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="!w-28">
              <p className="text-left  text-[#aeb3b6] text-sm">TO</p>
              <input
                type="number"
                placeholder="0"
                value={numberToString(Number(amountTo).toFixed(4))}
                onChange={(e) => setAmountTo(Number(e.target.value))}
                className={`appearance-none  bg-transparent border-0 p-0 text-3xl w-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${workSans.className} focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 outline-none`}
                style={{
                  minWidth: "140px", // Set a reasonable minimum width
                  width: `${amountTo.toString().length + 0.2}ch`, // Dynamically adjust width
                  height: "3.5rem",
                }}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between"></div>
              <Button
                variant="outline"
                className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white"
              >
                <Image
                  src={
                    activeTab === "buy"
                      ? CURRENT_DAO_IMAGE
                      : "https://scrollscan.com/assets/generic/html/favicon-light.ico"
                  }
                  alt={activeTab === "buy" ? "DAO Token" : "SCROLL Token"}
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {toLabel}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* <div className="flex justify-between text-sm">
          <div className="text-left space-y-1">
            <p className="text-[#aeb3b6] lg:text-lg md:text-md sm:text-sm">Price Impact</p>
            <p className="text-[#aeb3b6] lg:text-lg md:text-md sm:text-sm">Exchange</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="lg:text-lg md:text-md sm:text-sm">0.00%</p>
            <p className="lg:text-lg md:text-md sm:text-sm">-</p>
          </div>
        </div> */}

        <Button
          className="w-full bg-white text-black hover:bg-gray-200"
          onClick={handleSwap}
          disabled={isSwapping}
          style={{ height: "3rem" }}
        >
          {isSwapping ? "Swapping..." : "Swap"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Buysell;
