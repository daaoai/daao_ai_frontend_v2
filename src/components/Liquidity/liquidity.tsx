'use client';
import { getDexName, getDexURL } from '@/constants/dex';
import { useAddLiquidity } from '@/hooks/useAddLiquidity';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { DaoInfo, FundDetails } from '@/types/daao';
import { PoolDetails } from '@/types/pool';
import { throttle } from 'lodash';
import { FlipHorizontalIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import FallbackTokenLogo from '/public/assets/fallbackToken.svg';
import { truncateNumber } from '@/utils/numbers';

interface LiquidityProps {
  onClose: () => void;
  daoInfo: DaoInfo;
  poolDetails: PoolDetails;
  fundDetails: FundDetails;
  chainId: number;
}

const Liquidity: React.FC<LiquidityProps> = ({ onClose, daoInfo, poolDetails, fundDetails, chainId }) => {
  const { isConnected, address } = useAccount();
  const [customSlippage, setCustomSlippage] = useState<number | undefined>(undefined);
  const [customRange, setCustomRange] = useState<number | undefined>(undefined);
  const {
    srcTokenDetails,
    destTokenDetails,
    srcTokenFormattedAmount,
    dstTokenFormattedAmount,
    selectedRange,
    isDataLoading,
    handleAddLiquidity,
    txnInProgress,
    lowerPrice,
    upperPrice,
    currentPrice,
    handleSwitch,
    slippageTolerance,
    setSlippageTolerance,
    setSrcTokenFormattedAmount,
    setSelectedRange,
  } = useAddLiquidity({
    chainId,
    daoInfo,
    fundDetails,
    poolDetails,
  });

  const handleInputAmountChange = throttle((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSrcTokenFormattedAmount(value);
  }, 300);

  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [isSlippageSettingsOpen, setIsSlippageSettingsOpen] = useState(false);

  return (
    <div className="liquidity_main-container max-h-[80vh] sm:max-h-none overflow-y-auto z-50">
      <div className="flex flex-col md:flex-row gap-6 bg-gray-40 p-8 items-center justify-center rounded-lg">
        <div className="flex flex-col gap-6 items-start">
          <Image src={fundDetails.imgSrc} alt={fundDetails.title} width={400} height={400} />
          <div className="flex flex-col items-start gap-4">
            <p className="text-2xl font-sora font-medium text-white">{fundDetails.title}</p>
            <Link
              href={getDexURL({
                chainId,
                daaoToken: daoInfo.daoToken,
                paymentToken: daoInfo.paymentToken,
                type: fundDetails.dexInfo.type,
              })}
              target="_blank"
              className="text-teal-60 font-normal"
            >
              {getDexName(fundDetails.dexInfo.type)}
            </Link>
          </div>
        </div>
        <div className="bg-black border-[#27292a] border-2 rounded-md text-white top-40 p-4 overflow-y-scroll max-h-[80vh]">
          <div>
            <p>Add Liquidity</p>
          </div>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              {/* Token 0 Input */}
              <div className="bg-gray-40 px-4 py-2 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 rounded-full px-3 py-1 cursor-pointer">
                    <Image
                      src={srcTokenDetails.logo || FallbackTokenLogo}
                      alt="Token logo"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="font-medium">{srcTokenDetails.symbol}</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.0"
                    className="text-right text-2xl bg-transparent border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={srcTokenFormattedAmount}
                    onChange={handleInputAmountChange}
                    min="0"
                    step="any"
                    inputMode="decimal"
                  />
                </div>
              </div>

              {/* Swap Icon */}
              <div className="flex justify-center -my-4 z-10">
                <Button
                  size="icon"
                  className="rounded-full bg-gray-40 hover:bg-gray-700 border-4 border-[#0d0d0d]"
                  onClick={handleSwitch}
                >
                  <FlipHorizontalIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Token 1 Input */}
              <div className="bg-gray-40 px-4 py-2 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 rounded-full px-3 py-1 cursor-pointer">
                    <Image
                      src={destTokenDetails.logo || FallbackTokenLogo}
                      alt={destTokenDetails.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="font-medium">{destTokenDetails.symbol}</span>
                  </div>
                  <Input
                    type="number"
                    // placeholder={initalRendering && token0Amount ? 'Calculating...' : '0.0'}
                    disabled={true}
                    className="text-right text-2xl bg-transparent border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={dstTokenFormattedAmount}
                  />
                </div>
              </div>
            </div>

            {/* Pool Info */}
            <div className="bg-gray-40 px-4 py-2 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exchange Rate</span>
                <span>
                  1 {srcTokenDetails.symbol} = {truncateNumber(currentPrice,8) || 0}{' '}
                  {destTokenDetails.symbol}
                </span>
              </div>
            </div>

            {/* Price Range Selection */}
            <div className="bg-gray-40 px-4 py-2 rounded-xl space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
              >
                <h3 className="text-sm font-medium">Select Price Range</h3>
                <svg
                  className={`w-5 h-5 transition-transform ${isPriceRangeOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${isPriceRangeOpen ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {[25, 50, 99].map((range) => (
                      <Button
                        key={range}
                        variant={selectedRange === range ? 'default' : 'outline'}
                        className={`text-sm ${
                          selectedRange === range
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-gray-40 text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          setSelectedRange(range);
                          setCustomRange(undefined);
                        }}
                      >
                        ±{range}%
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      placeholder="Custom"
                      className="flex-1 bg-gray-40 border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={customRange || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value) {
                          setCustomRange(value);
                          setSelectedRange(value);
                        } else {
                          setCustomRange(undefined);
                          setSelectedRange(25);
                        }
                      }}
                    />
                    <span className="text-gray-400 text-sm">%</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {`Your liquidity will be concentrated between ±${selectedRange}%`}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Price range: {truncateNumber(lowerPrice, 8)} to{' '}
                    {truncateNumber(upperPrice, 8)} {srcTokenDetails.symbol} per{' '}
                    {destTokenDetails.symbol}
                  </p>
                </div>
              </div>
            </div>

            {/* Slippage Tolerance */}
            <div className="space-y-4">
              {/* Settings Trigger */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsSlippageSettingsOpen(!isSlippageSettingsOpen)}
              >
                <span className="text-sm">Slippage Tolerance</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isSlippageSettingsOpen ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Collapsible Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isSlippageSettingsOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <div className="bg-gray-40 px-4 py-2 rounded-xl space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[0.1, 0.5, 1].map((slippage) => (
                      <Button
                        key={slippage}
                        variant={slippageTolerance === slippage ? 'default' : 'outline'}
                        className={`text-sm ${
                          slippageTolerance === slippage
                            ? 'bg-white text-black hover:bg-gray-100'
                            : 'bg-gray-40 text-gray-300 hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          setSlippageTolerance(slippage);
                          setCustomSlippage(undefined);
                        }}
                      >
                        {slippage}%
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Custom"
                      min={0.01}
                      max={50}
                      className="flex-1 bg-gray-40 border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={customSlippage || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value) {
                          setCustomSlippage(value);
                          setSlippageTolerance(value);
                        } else {
                          setCustomSlippage(undefined);
                          setSlippageTolerance(0.1);
                        }
                      }}
                    />
                    <span className="text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Liquidity Button */}
            <Button
              className="w-full py-2 text-lg bg-teal-50 text-black hover:bg-gray-100 rounded-xl"
              onClick={handleAddLiquidity}
              disabled={
                !Number(srcTokenFormattedAmount) || !Number(dstTokenFormattedAmount) || txnInProgress || isDataLoading
              }
            >
              {txnInProgress ? 'Txn in progress...' : 'Add Liquidity'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liquidity;
