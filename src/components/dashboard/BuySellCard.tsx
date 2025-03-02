import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { FiSettings } from 'react-icons/fi';
import ModeTokenLogo from '/public/assets/mode.png';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useReadContracts } from 'wagmi';
import { useFetchBalance } from '../../hooks/useFetchBalance';
import { useFundContext } from './FundContext';
import TicketPurchase from '../ticket';
import { ModalWrapper } from '../modalWrapper';
import CollectedTickets from '../collectedTickets';
import useGetUserTickets from '@/hooks/useGetUserTickets';
import { MODE_ABI } from '@/daao-sdk/abi/mode';
import { DAO_TOKEN_ABI } from '@/daao-sdk/abi/daoToken';
import { VELO_POOL_ABI } from '@/daao-sdk/abi/veloPool';
import { VELO_FACTORY_ABI } from '@/daao-sdk/abi/veloFactory';
import { SWAP_ROUTER_SIMULATE } from '@/daao-sdk/abi/swapRouterSimulate';
import { CURRENT_DAO_IMAGE } from '@/constants/links';
import { ROUTER_ABI } from '@/daao-sdk/abi/router';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { Button } from '@/shadcn/components/ui/button';
import React from 'react';
import { clPoolRouterAddress, modeTokenAddress, swapRouterAddress, veloFactoryAddress } from '@/constants/addresses';
import { tickSpacing } from '@/constants/modeChain';

const BuySellCard = () => {
  const { toast } = useToast();
  const account = useAccount();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState(0);
  const [firstTokenMode, setFirstTokenMode] = useState(false);
  const [currentSqrtPrice, setCurrentSqrtPrice] = useState<string>('');
  const [slippageOpen, setSlippageOpen] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState('1');
  const [isSwapping, setIsSwapping] = useState(false);
  const [modeBalance, setModeBalance] = useState('0');
  const [daoTokenAddress, setDaoTokenAddress] = useState('');
  const [poolAddress, setPoolAddress] = useState('');
  const { daoBalance, setDaoBalance } = useFundContext();
  const { ticketIds, refetch: refetchTickets } = useGetUserTickets();
  const accountAddress = account.address as `0x${string}`;
  const { data: fetchedData, refreshData } = useFetchBalance(accountAddress);

  const { data: daoReadData, refetch } = useReadContracts({
    contracts: daoTokenAddress
      ? [
          {
            address: daoTokenAddress as `0x${string}`,
            abi: DAO_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [accountAddress],
          },
        ]
      : [],
  });

  useEffect(() => {
    console.log('daoToken is', fetchedData?.daoToken);
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
      if (!window.ethereum) {
        console.log('MetaMask is not installed');
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const factoryContract = new ethers.Contract(veloFactoryAddress, VELO_FACTORY_ABI, provider);
        const pool = await factoryContract.callStatic.getPool(modeTokenAddress, daoTokenAddress, tickSpacing);
        console.log('Pool:', pool);

        if (pool && pool !== ethers.constants.AddressZero) {
          setPoolAddress(pool);
          console.log('Pool Address:', pool);
        } else {
          console.log('Pool does not exist for these tokens.');
        }
      } catch (error) {
        console.error('Error fetching pool address:', error);
      }
    };

    fetchPoolAddress();
  }, [daoTokenAddress]);

  useEffect(() => {
    if (!poolAddress) return;
    fetchPoolTokens();
    fetchSlot0();
    fetchBalances();
    setAmountFrom('');
    setAmountTo(0);
  }, [activeTab, poolAddress]);

  async function fetchSlot0() {
    if (!poolAddress) return;
    if (!window.ethereum) return;
    try {
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const poolContract = new ethers.Contract(poolAddress, VELO_POOL_ABI, provider);
      // const [sqrtPriceX96] = await poolContract.slot0();
      setCurrentSqrtPrice(zeroForOne === true ? '4295128750' : '1461446703485210103287273052203988822378723970300');
    } catch (error) {
      console.error('Error fetching slot0:', error);
    }
  }

  async function fetchPoolTokens() {
    if (!poolAddress) return;
    if (!window.ethereum) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const poolContract = new ethers.Contract(poolAddress, VELO_POOL_ABI, provider);
      const t0 = await poolContract.token0();
      const t1 = await poolContract.token1();
      if (t0 === modeTokenAddress) {
        setFirstTokenMode(true);
      } else if (t1 === modeTokenAddress) {
        setFirstTokenMode(false);
      }
    } catch (error) {
      console.error('Error fetching pool tokens:', error);
    }
  }

  async function fetchBalances() {
    if (!window.ethereum) return;
    if (activeTab !== 'buy') {
      setModeBalance('0');
    }
  }

  function computeZeroForOne() {
    if (firstTokenMode === null) {
      return false;
    }
    if (firstTokenMode) {
      return activeTab === 'buy' ? true : false;
    } else {
      return activeTab === 'buy' ? false : true;
    }
  }

  const zeroForOne = computeZeroForOne();

  async function simulateSwap(newFromValue: string) {
    if (!window.ethereum || !poolAddress || !currentSqrtPrice) return;
    try {
      if (activeTab === 'buy') {
        if (Number(modeBalance) < Number(newFromValue)) {
          toast({
            title: 'Insufficient balance',
            variant: 'destructive',
          });
          setAmountTo(0);
          return;
        }
      }
      if (activeTab === 'sell') {
        if (Number(daoBalance) < Number(newFromValue)) {
          toast({
            title: 'Insufficient balance',
            variant: 'destructive',
          });
          setAmountTo(0);
          return;
        }
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const clPoolRouter = new ethers.Contract(swapRouterAddress, SWAP_ROUTER_SIMULATE, signer);
      const amountSpecified = ethers.utils.parseUnits(newFromValue, 18);
      // const minOutput = 0;
      if (!currentSqrtPrice) return;
      // const sqrtPriceBN = ethers.BigNumber.from(currentSqrtPrice);
      // let sqrtPriceLimitBN: ethers.BigNumber;
      // const slippageBps = 1;
      // if (zeroForOne) {
      //   sqrtPriceLimitBN = sqrtPriceBN.mul(100 - slippageBps).div(100);
      // } else {
      //   sqrtPriceLimitBN = sqrtPriceBN.mul(100 + slippageBps).div(100);
      // }
      console.log('sqrtPriceLimitBN:', currentSqrtPrice);
      console.log('zeroForOne:', zeroForOne);
      const sqrtPriceLimitX96 = currentSqrtPrice;
      // const deadline = Math.floor(Date.now() / 1000) + 5 * 60;
      const amount1 = await clPoolRouter.callStatic.quoteExactInputSingle(
        poolAddress,
        zeroForOne,
        amountSpecified,
        sqrtPriceLimitX96
      );

      let outBnAbs = amount1;
      if (outBnAbs.lt(0)) {
        outBnAbs = outBnAbs.mul(-1);
      }
      const outTokens = ethers.utils.formatUnits(outBnAbs, 18);

      console.log('Simulated swap output:', outTokens);
      setAmountTo(parseFloat(outTokens));
    } catch (err) {
      console.error('Error simulating swap:', err);
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

  async function checkAndApproveDAO(signer: ethers.Signer) {
    if (!daoTokenAddress) return;
    const userAddress = await signer.getAddress();
    const daoTokenContract = new ethers.Contract(daoTokenAddress, DAO_TOKEN_ABI, signer);

    const requiredAmountBN = ethers.utils.parseUnits(amountFrom || '0', 18);

    const currentAllowance: ethers.BigNumber = await daoTokenContract.allowance(userAddress, clPoolRouterAddress);
    if (currentAllowance.lt(requiredAmountBN)) {
      console.log('Approving DAO tokens...');
      const approveTx = await daoTokenContract.approve(clPoolRouterAddress, requiredAmountBN);
      await approveTx.wait();
      console.log('DAO token approval completed!');
    }
  }

  async function checkAndApproveMODE(signer: ethers.Signer) {
    if (!daoTokenAddress) return;
    const userAddress = await signer.getAddress();
    const ModeTokenContract = new ethers.Contract(modeTokenAddress, MODE_ABI, signer);

    const requiredAmountBN = ethers.utils.parseUnits(amountFrom || '0', 18);

    const currentAllowance: ethers.BigNumber = await ModeTokenContract.allowance(userAddress, clPoolRouterAddress);
    console.log('Current allowance:', currentAllowance.toString());
    if (currentAllowance.lt(requiredAmountBN)) {
      console.log('Approving DAO tokens...');
      const approveTx = await ModeTokenContract.approve(clPoolRouterAddress, requiredAmountBN);
      await approveTx.wait();
      console.log('DAO token approval completed!');
    }
  }

  async function handleSwap() {
    try {
      setIsSwapping(true);

      if (!window.ethereum) throw new Error('No Ethereum provider found');
      if (!amountFrom) {
        toast({
          title: 'No amount specified',
          variant: 'destructive',
        });
        return;
      }
      if (amountFrom === '0') {
        toast({
          title: 'Amount must be greater than 0',
          variant: 'destructive',
        });
        return;
      }
      if (activeTab === 'buy' && Number(modeBalance) < Number(amountFrom)) {
        toast({
          title: 'Insufficient balance',
          variant: 'destructive',
        });
        return;
      }
      if (activeTab === 'sell' && Number(daoBalance) < Number(amountFrom)) {
        toast({
          title: 'Insufficient balance',
          variant: 'destructive',
        });
        return;
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      if (activeTab === 'sell') {
        await checkAndApproveDAO(signer);
      } else if (activeTab === 'buy') {
        await checkAndApproveMODE(signer);
      }
      const clPoolRouter = new ethers.Contract(clPoolRouterAddress, ROUTER_ABI, signer);
      const amountSpecified = ethers.utils.parseUnits(amountFrom || '0', 'ether');
      console.log('amountSpecified:', amountSpecified.toString());

      const slipDecimal = parseFloat(slippageTolerance) / 100;
      console.log('Slippage decimal:', slipDecimal);
      const quotedOut = amountTo;
      const minOutputNumber = quotedOut * (1 - slipDecimal);
      console.log('minOutputNumber:', minOutputNumber);
      const minOutputBN = ethers.utils.parseUnits(minOutputNumber.toFixed(6), 18);
      console.log('minOutput:', minOutputBN);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
      console.log('deadline:', deadline);
      if (!currentSqrtPrice) {
        throw new Error('No currentSqrtPrice found. Please ensure slot0 is loaded.');
      }

      // const sqrtPriceBN = ethers.BigNumber.from(currentSqrtPrice);
      // let sqrtPriceLimitBN: ethers.BigNumber;
      // const slippageBps = 1;

      // if (zeroForOne) {
      //   sqrtPriceLimitBN = sqrtPriceBN.mul(100 - slippageBps).div(100);
      // } else {
      //   sqrtPriceLimitBN = sqrtPriceBN.mul(100 + slippageBps).div(100);
      // }
      //4295128750
      const sqrtPriceLimitX96 = currentSqrtPrice;
      console.log('zeroforone is', zeroForOne);
      console.log('sqrtPriceLimitX96:', sqrtPriceLimitX96);
      console.log(amountSpecified);
      console.log(minOutputBN);
      console.log(deadline);

      const tx = await clPoolRouter.getSwapResult(
        poolAddress,
        zeroForOne,
        amountSpecified,
        sqrtPriceLimitX96,
        minOutputBN,
        deadline
      );

      const receipt = await tx.wait();
      // alert(`Swap successful!\nTransaction Hash: ${receipt.transactionHash}`)

      await fetchSlot0();
      setAmountFrom('');
      setAmountTo(0);
      console.log('Swap successful!', receipt);
    } catch (error) {
      console.error('Error during swap:', error);
    } finally {
      if (activeTab === 'buy') {
        // Spent MODE
        setModeBalance((prev) => (Number(prev) - Number(amountFrom)).toString());
        // Gained DAO
        setDaoBalance((prev) => (Number(prev) + Number(amountTo)).toString());
      } else {
        // Spent DAO
        setDaoBalance((prev) => (Number(prev) - Number(amountFrom)).toString());
        // Gained MODE
        setModeBalance((prev) => (Number(prev) + Number(amountTo)).toString());
      }
      refetch();
      refreshData();
      setIsSwapping(false);
      setAmountFrom('');
      setAmountTo(0);
    }
  }
  const fromLabel = activeTab === 'buy' ? 'MODE' : 'CARTEL';
  const toLabel = activeTab === 'buy' ? 'CARTEL' : 'MODE';
  const [isBurnTicketModalOpen, setIsBurnTicketModalOpen] = useState(false);
  const [isCollectedTicketModalOpen, setIsCollectedTicketModalOpen] = useState(false);
  const openBurnTicketModal = useCallback(() => setIsBurnTicketModalOpen(true), []);
  const closeBurnTicketModal = useCallback(() => setIsBurnTicketModalOpen(false), []);
  const openCollectedTicketModal = useCallback(() => setIsCollectedTicketModalOpen(true), []);
  const closeCollectedTicketModal = useCallback(() => setIsCollectedTicketModalOpen(false), []);

  const handleBurnTicketModal = () => {
    if (account.address) {
      openBurnTicketModal();
    } else {
      toast({
        title: 'Wallet Not Connected',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-full w-full max-w-xl bg-[#0e0e0e] text-white">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'buy' | 'sell')} className="w-full h-12">
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
            type="button"
            onClick={() => setSlippageOpen(!slippageOpen)}
            className="p-2 hover:bg-[#1b1c1d] rounded-md"
          >
            <FiSettings size={20} />
          </button>
        </div>

        {slippageOpen && (
          <div className="border p-3 bg-[#1b1c1d] rounded-md">
            <label className="block text-sm text-[#aeb3b6] mb-1">Slippage Tolerance (%)</label>
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

        <Card className="bg-[#1b1c1d] border-0">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-left text-[#aeb3b6] text-sm">FROM</p>
              <input
                type="number"
                placeholder="0"
                value={amountFrom}
                onChange={handleFromChange}
                className={`appearance-none bg-transparent border-0 p-0 text-3xl w-100 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `}
                style={{
                  minWidth: '140px',
                  width: `${amountTo.toString().length + 2}ch`,
                  height: '3.5rem',
                }}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between">
                <span className="text-[#aeb3b6]">
                  Balance: {activeTab === 'buy' ? Number(modeBalance).toFixed(3) : Number(daoBalance).toFixed(3)}
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
              <Button variant="outline" className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white">
                <Image
                  src={activeTab === 'buy' ? ModeTokenLogo : CURRENT_DAO_IMAGE}
                  alt={activeTab === 'buy' ? 'MODE Token' : 'DAO Token'}
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
            <div>
              <p className="text-left  text-[#aeb3b6] text-sm">TO</p>
              <input
                type="number"
                placeholder="0"
                value={amountTo}
                onChange={(e) => setAmountTo(Number(e.target.value))}
                className={`appearance-none bg-transparent border-0 p-0 text-3xl w-24 focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 outline-none`}
                style={{
                  minWidth: '140px', // Set a reasonable minimum width
                  width: `${amountTo.toString().length + 0.2}ch`, // Dynamically adjust width
                  height: '3.5rem',
                }}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between"></div>
              <Button variant="outline" className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white">
                <Image
                  src={activeTab === 'buy' ? CURRENT_DAO_IMAGE : ModeTokenLogo}
                  alt={activeTab === 'buy' ? 'DAO Token' : 'MODE Token'}
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
          style={{ height: '3rem' }}
        >
          {isSwapping ? 'Swapping...' : 'Swap'}
        </Button>
        {/* @devs please don't remove this comented code */}
        <Button
          className="w-full bg-white text-black hover:bg-gray-200 active:scale-95 transition-transform ease-in-out duration-150"
          onClick={handleBurnTicketModal}
          style={{ height: '3rem' }}
        >
          Burn Tokens and get tickets.
        </Button>

        {ticketIds && (
          <Button
            className="w-full bg-white text-black hover:bg-gray-200 active:scale-95 transition-transform ease-in-out duration-150"
            onClick={openCollectedTicketModal}
            disabled={isSwapping}
            style={{ height: '3rem' }}
          >
            Collected Tickets.
          </Button>
        )}
        <ModalWrapper isOpen={isBurnTicketModalOpen} onClose={closeBurnTicketModal}>
          <TicketPurchase onClose={closeBurnTicketModal} onTicketsUpdated={refetchTickets} />
        </ModalWrapper>
        <ModalWrapper isOpen={isCollectedTicketModalOpen} onClose={closeCollectedTicketModal}>
          <CollectedTickets onClose={closeCollectedTicketModal} tickets={ticketIds} />
        </ModalWrapper>
      </CardContent>
    </Card>
  );
};

export default BuySellCard;
