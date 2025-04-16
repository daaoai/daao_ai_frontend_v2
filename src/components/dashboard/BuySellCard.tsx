'use client';
import { fundsByChainId } from '@/data/funds';
import { useSwap } from '@/hooks/swap/useSwap';
import useDebounce from '@/hooks/useDebounce';
import useGetUserTickets from '@/hooks/useGetUserTickets';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { DaoInfo } from '@/types/daao';
import { PoolDetails } from '@/types/pool';
import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatUnits, Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import CollectedTickets from '../collectedTickets';
import { ModalWrapper } from '../modalWrapper';
import SlippageModal from '../slippageModal';
import TicketPurchase from '../ticket';
import FallbackTokenLogo from '/public/assets/fallbackToken.svg';

const BuySellCard = ({
  chainId,
  fundAddress,
  daaoInfo,
  poolDetails,
}: {
  chainId: number;
  fundAddress: Hex;
  daaoInfo: DaoInfo | null;
  poolDetails: PoolDetails | null;
}) => {
  // account
  const { address: accountAddress } = useAccount();
  const account = accountAddress as Hex;
  const fundDetails = fundsByChainId[chainId][fundAddress];

  // states
  const [slippageOpen, setSlippageOpen] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState('1');

  // hooks
  const { ticketIds, refetch: refetchTickets } = useGetUserTickets();
  const {
    activeTab,
    fetchQuotes,
    setToAmount,
    handleSwap,
    setDaoInfo,
    setPoolDetails,
    sellToken,
    buyToken,
    sellTokenBalance,
    setActiveTab,
    isSwapping,
    toAmount,
  } = useSwap({ chainId, fundDetails });

  // constants
  const [formattedSrcAmount, setFormattedSrcAmount] = useState<string>('');
  const formattedSellTokenBalance = formatUnits(sellTokenBalance, sellToken?.decimals || 18);
  const formattedToAmount = formatUnits(toAmount, buyToken?.decimals || 18);

  const handleFormChange = useDebounce((val: string) => {
    setFormattedSrcAmount(val);
    if (Number(val) > 0) {
      fetchQuotes(parseUnits(val, sellToken?.decimals || 18));
    } else {
      setToAmount(BigInt(0));
    }
  }, 500);

  const fromLabel = sellToken?.symbol;
  const toLabel = buyToken?.symbol;
  const [isBurnTicketModalOpen, setIsBurnTicketModalOpen] = useState(false);
  const [isCollectedTicketModalOpen, setIsCollectedTicketModalOpen] = useState(false);
  const openBurnTicketModal = useCallback(() => setIsBurnTicketModalOpen(true), []);
  const closeBurnTicketModal = useCallback(() => setIsBurnTicketModalOpen(false), []);
  const openCollectedTicketModal = useCallback(() => setIsCollectedTicketModalOpen(true), []);
  const closeCollectedTicketModal = useCallback(() => setIsCollectedTicketModalOpen(false), []);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const openSettingModal = useCallback(() => setIsSettingModalOpen(true), []);
  const closeSettingModal = useCallback(() => setIsSettingModalOpen(false), []);

  const handleBurnTicketModal = () => {
    if (account) {
      openBurnTicketModal();
    } else {
      toast.error('Wallet Not Connected');
    }
  };

  const handleActiveTabChage = (val: string) => {
    setActiveTab(val as 'buy' | 'sell');
    setFormattedSrcAmount('');
    setToAmount(BigInt(0));
  };

  useEffect(() => {
    if (daaoInfo) {
      setDaoInfo(daaoInfo);
    }
  }, [daaoInfo]);

  useEffect(() => {
    if (poolDetails) {
      setPoolDetails(poolDetails);
    }
  }, [poolDetails]);

  return (
    <Card className="h-fit w-full max-w-xl bg-[#0e0e0e] text-white border-none">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={(val) => handleActiveTabChage(val)} className="w-full h-12">
            <div className="relative w-full">
              <TabsList className="flex gap-4 bg-[#1b1c1d] h-12 relative p-1 rounded-md">
                <motion.div
                  layoutId="tabBackground"
                  className="absolute top-1 left-1 bottom-1 bg-teal-40 rounded-md w-[50%]"
                  initial={false}
                  animate={{
                    x: activeTab === 'buy' ? '0%' : '100%',
                  }}
                  transition={{ type: 'tween', duration: 0.3 }}
                />

                {/* Buy Tab */}
                <TabsTrigger
                  value="buy"
                  className={`relative w-full lg:text-xl md:text-lg sm:text-md px-4 py-2 transition-all ${
                    activeTab === 'buy' ? 'text-black' : 'text-white'
                  }`}
                >
                  Buy
                </TabsTrigger>

                {/* Sell Tab */}
                <TabsTrigger
                  value="sell"
                  className={`relative w-full lg:text-xl md:text-lg sm:text-md px-4 py-2 transition-all ${
                    activeTab === 'sell' ? 'text-black' : 'text-white'
                  }`}
                >
                  Sell
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* <div className="flex w-full gap-2 items-center justify-between">
          <button
            onClick={() => setAmountFrom('1000')}
            className="bg-gray-40 rounded-md p-2 text-sm active:scale-95 transition-transform ease-in-out duration-150"
          >
            1000 PAYMENT TOKEN
          </button>
          <button
            onClick={() => setAmountFrom('10000')}
            className="bg-gray-40 rounded-md p-2 text-sm active:scale-95 transition-transform ease-in-out duration-150"
          >
            10000 PAYMENT TOKEN
          </button>
          <button
            onClick={() => setAmountFrom('50000')}
            className="bg-gray-40 rounded-md p-2 text-sm active:scale-95 transition-transform ease-in-out duration-150"
          >
            50000 PAYMENT TOKEN
          </button>
          <button
            onClick={() => setAmountFrom('100000')}
            className="bg-gray-40 rounded-md p-2 text-sm active:scale-95 transition-transform ease-in-out duration-150"
          >
            100000 PAYMENT TOKEN
          </button>
        </div> */}

        <Card className="bg-gray-50 border-2 border-gray-20">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="w-40">
              <p className="text-left text-[#aeb3b6] text-sm">FROM</p>
              <input
                type="number"
                placeholder="0"
                value={formattedSrcAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormattedSrcAmount(val);
                  handleFormChange(val);
                }}
                className={`appearance-none outline-none w-full bg-transparent border-1 p-0 text-3xl w-100 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between">
                <span className="text-[#aeb3b6]">Balance: {Number(formattedSellTokenBalance).toFixed(6)}</span>
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
                  src={sellToken?.logo || FallbackTokenLogo}
                  alt={sellToken?.symbol || 'PT'}
                  width={16}
                  height={16}
                  className="mr-2 [&>path]:stroke-white [&>circle]:stroke-white"
                />
                {fromLabel}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-2 border-gray-20">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="w-40">
              <p className="text-left  text-[#aeb3b6] text-sm">TO</p>
              <input
                type="number"
                disabled
                placeholder="0"
                value={formattedToAmount}
                onChange={(e) => {}}
                className={`appearance-none w-full bg-transparent p-0 text-3xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 outline-none`}
              />
            </div>
            <div className="space-y-2 text-right">
              <div className="text-sm flex flex-row justify-between"></div>
              <Button variant="outline" className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white">
                <Image
                  src={buyToken?.logo || FallbackTokenLogo}
                  alt={buyToken?.symbol || 'DAO Token'}
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
        <div className="flex justify-between items-start">
          <p className="text-sm">Slippage</p>
          <p className="text-sm">{slippageTolerance}</p>
        </div>

        <Button
          className="w-full bg-teal-50 text-black hover:bg-teal-60 active:scale-95 transition-transform ease-in-out duration-150"
          onClick={() => {
            if (account) {
              const amountInUnits = parseUnits(formattedSrcAmount, sellToken?.decimals || 18);
              handleSwap(amountInUnits).then(() => {
                setFormattedSrcAmount('');
              });
            } else {
              toast.error('Wallet Not Connected');
            }
          }}
          disabled={isSwapping}
          style={{ height: '3rem' }}
        >
          {isSwapping ? 'Swapping...' : 'Swap'}
        </Button>
        <button
          type="button"
          title="settings"
          onClick={openSettingModal}
          className="p-2 hover:bg-[#1b1c1d] rounded-md flex items-center gap-4 text-paleGreen"
        >
          <Settings2 size={20} className="text-paleGreen" />
          Set Slippage
        </button>
        <ModalWrapper isOpen={isSettingModalOpen} onClose={closeSettingModal}>
          <SlippageModal onClose={closeSettingModal} setSlippageTolerance={setSlippageTolerance} />
        </ModalWrapper>
        {/* @devs please don't remove this comented code */}
        {/* <Button
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
        )} */}
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

export default memo(BuySellCard);
