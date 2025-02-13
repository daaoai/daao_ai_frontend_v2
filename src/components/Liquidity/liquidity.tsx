'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '@/components/ui/input'
import ModeTokenLogo from "../../assets/icons/mode.png";
import { FlipHorizontalIcon } from 'lucide-react'
import Image from 'next/image'
import { ethers } from "ethers";
import DAO_ABI from '@/lib/abis/daoAbi.json'
import ERC20_ABI from '@/erc20Abi.json'
import { CURRENT_DAO_IMAGE } from '@/lib/links';
import { daoAddress, modeTokenAddress, tickSpacing, veloFactoryAddress, nonFungiblePositionManagerAddress, quoterAddress } from '@/common/common'
import VELO_FACTORY_ABI from '@/lib/abis/veloAbi.json'
import POOL_ABI from '@/lib/abis/poolAbi.json'
import poolAbi from "../../poolABI.json"
import velodromeFactoryABI from "../../veloABI.json"
import bn from 'bignumber.js'
import QUOTER_ABI from '@/lib/abis/quoterAbi.json';
import { Token } from '@uniswap/sdk-core'
import { Pool, Position } from '@uniswap/v3-sdk'
import { Percent } from '@uniswap/sdk-core'
import { formatUnits } from 'ethers/lib/utils'
import { parseUnits } from 'ethers/lib/utils'

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })


const Liquidity = () => {

    const MODE_TOKEN_ADDRESS = modeTokenAddress;
    const TICK_SPACING = tickSpacing;
    const DAO_TOKEN_ADDRESS = daoAddress || process.env.NEXT_PUBLIC_DAO_ADDRESS;
    const VELO_FACTORY_ADDRESS = veloFactoryAddress || process.env.NEXT_PUBLIC_VELO_FACTORY_ADDRESS;
    const NON_FUNGIBLE_POSITION_MANAGER_ADDRESS = nonFungiblePositionManagerAddress || process.env.NEXT_PUBLIC_NON_FUNGIBLE_POSITION_MANAGER_ADDRESS;
    const QUOTER_ADDRESS = quoterAddress || process.env.NEXT_PUBLIC_QUOTER_ADDRESS;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token0Amount, setToken0Amount] = useState('');
    const [token1Amount, setToken1Amount] = useState('');
    const [token0, setToken0] = useState('CARTEL');
    const [token1, setToken1] = useState('MODE');
    const [selectedRange, setSelectedRange] = useState('3');
    const [customRange, setCustomRange] = useState('');
    const [daoToken, setDaoToken] = useState<{
        address: string;
        symbol: string;
        name: string;
    } | null>(null);
    const [token0Address, setToken0Address] = useState('');
    const [token0Decimals, setToken0Decimals] = useState(18);
    const [poolAddress, setPoolAddress] = useState<string>('');
    const [slippageTolerance, setSlippageTolerance] = useState('1');
    const [customSlippage, setCustomSlippage] = useState('');
    const [isSlippageSettingsOpen, setIsSlippageSettingsOpen] = useState(false);
    const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

    const [sqrtPriceX96, setSqrtPriceX96] = useState<ethers.BigNumber | null>(null)

    const [activeInput, setActiveInput] = useState<'token0' | 'token1'>('token0');

    const fetchDecimals = async (tokenAddress: string) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenContract = new ethers.Contract(
            tokenAddress,
            ERC20_ABI,
            provider
        );
        return tokenContract.decimals();
    };

    const fetchDAOTokenInfo = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const daoContract = new ethers.Contract(
            DAO_TOKEN_ADDRESS!,
            DAO_ABI,
            provider
        );

        const [address, symbol, name] = await Promise.all([
            daoContract.daoToken(),
            daoContract.symbol(),
            daoContract.name()
        ]);

        return { address, symbol, name };
    };


    // Getting Quote 

    // Function to get pool info including sqrtPriceX96
    const fetchPoolInfo = async () => {
        if (!poolAddress) return

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)

        try {
            const slot0 = await poolContract.slot0();
            console.log(slot0, "slot0");
            setSqrtPriceX96(slot0.sqrtPriceX96)
        } catch (error) {
            console.error('Error fetching pool info:', error)
        }
    }

    // Modify calculateAmounts to handle single-direction calculation
    const calculateAmounts = async (
        amount0: string,
        amount1: string,
        tickLower: number,
        tickUpper: number
    ) => {
        if (!poolAddress || !sqrtPriceX96) return { amount0: '0', amount1: '0' };

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);

        const pool = new Pool(
            new Token(
                1,
                token0Address || '',  // Fallback to empty string
                token0Decimals,
                token0,
                daoToken?.name || token0  // Fallback to token symbol if name is undefined
            ),
            new Token(
                1,
                MODE_TOKEN_ADDRESS || '',  // Fallback to empty string
                18,
                token1,
                'MODE'
            ),
            100,
            sqrtPriceX96.toString(),
            1,
            (await poolContract.slot0()).tick
        );

        let position: Position;
        if (activeInput === 'token0' && amount0) {
            position = Position.fromAmount0({
                pool,
                tickLower,
                tickUpper,
                amount0: parseUnits(amount0, token0Decimals).toString(),
                useFullPrecision: true
            });
        } else {
            position = Position.fromAmount1({
                pool,
                tickLower,
                tickUpper,
                amount1: parseUnits(amount1, 18).toString(),
            });
        }

        const slippage = new Percent(slippageTolerance, 10_000);
        const { amount0: min0, amount1: min1 } = position.mintAmountsWithSlippage(slippage);

        return {
            amount0: formatUnits(min0.toString(), token0Decimals),
            amount1: formatUnits(min1.toString(), 18)
        };
    };
    // Update token0 input handler
    const handleToken0Change = async (value: string) => {
        setToken0Amount(value);
        setActiveInput('token0');
        if (value && poolAddress && sqrtPriceX96) {
            const calculated = await calculateAmounts(value, '', tickLow, tickHigh);
            setToken1Amount(calculated.amount1);
        }
    };

    // Update token1 input handler
    const handleToken1Change = async (value: string) => {
        setToken1Amount(value);
        setActiveInput('token1');
        if (value && poolAddress && sqrtPriceX96) {
            const calculated = await calculateAmounts('', value, tickLow, tickHigh);
            setToken0Amount(calculated.amount0);
        }
    };

    // Add tick calculation function
    const calculateTickRange = (sqrtPriceX96: ethers.BigNumber, rangePercentage: number) => {
        if (!sqrtPriceX96) return { tickLow: -887272, tickHigh: 887272 }

        const Q96 = new bn(2).pow(96)
        const sqrtPrice = new bn(sqrtPriceX96.toString())
        const price = sqrtPrice.pow(2).div(Q96.pow(2)).times(10 ** (18 - token0Decimals))

        const tickLow = Math.log(price.times(1 - rangePercentage / 100).toNumber()) / Math.log(1.0001)
        const tickHigh = Math.log(price.times(1 + rangePercentage / 100).toNumber()) / Math.log(1.0001)

        return {
            tickLow: Math.floor(tickLow / TICK_SPACING) * TICK_SPACING,
            tickHigh: Math.ceil(tickHigh / TICK_SPACING) * TICK_SPACING
        }
    }

    // Usage in handlers:
    const { tickLow, tickHigh } = sqrtPriceX96
        ? calculateTickRange(sqrtPriceX96, Number(selectedRange || customRange))
        : { tickLow: -887272, tickHigh: 887272 }



    useEffect(() => {
        if (poolAddress) {
            fetchPoolInfo();
        }
    }, [poolAddress])





    // getting quote end 



    useEffect(() => {
        const fetchDaoToken = async () => {
            const daoTokenInfo = await fetchDAOTokenInfo();
            if (!daoTokenInfo) return;

            setDaoToken(daoTokenInfo);
            setToken0(daoTokenInfo.symbol);
            setToken0Address(daoTokenInfo.address);
            fetchDecimals(daoTokenInfo.address).then(setToken0Decimals);
        };

        fetchDaoToken();
    }, []);

    useEffect(() => {
        const fetchPoolAddress = async () => {
            if (!token0Address || !MODE_TOKEN_ADDRESS) return;

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const factoryContract = new ethers.Contract(
                VELO_FACTORY_ADDRESS!,
                VELO_FACTORY_ABI,
                // velodromeFactoryABI,
                provider
            );

            const [tokenA, tokenB] = [token0Address, MODE_TOKEN_ADDRESS].sort();

            try {
                const pool = await factoryContract.getPool(
                    tokenA,
                    tokenB,
                    TICK_SPACING
                );

                if (pool !== ethers.constants.AddressZero) {
                    setPoolAddress(pool);
                } else {
                    console.log('Pool does not exist yet');
                    setPoolAddress('');
                }
            } catch (error) {
                console.error('Error fetching pool:', error);
            }
        };

        fetchPoolAddress();
    }, [token0Address, MODE_TOKEN_ADDRESS]);

    const handleSwap = () => {
        // Swap tokens and their amounts
        const tempToken = token0;
        const tempAmount = token0Amount;

        setToken0(token1);
        setToken1(tempToken);
        setToken0Amount(token1Amount);
        setToken1Amount(tempAmount);
    };


    return (
        <div>
            <div className="liquidity_main-container">
                <div className="liquidity_container">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white text-black text-sm rounded-full p-4 hover:bg-white hover:text-black"
                            >
                                Add liquidity
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[450px] bg-[#0d0d0d] border-[#27292a] text-white">
                            <DialogHeader>
                                <DialogTitle>Add Liquidity</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="space-y-4">
                                    {/* Token 0 Input */}
                                    <div className="bg-gray-900 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2 rounded-full px-3 py-1 cursor-pointer">
                                                <Image
                                                    src={daoToken?.symbol === token0 ? CURRENT_DAO_IMAGE : ModeTokenLogo}
                                                    alt="Token logo"
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                                <span className="font-medium">
                                                    {token0}
                                                </span>
                                            </div>
                                            <Input
                                                type="number"
                                                placeholder="0.0"
                                                className="text-right text-2xl bg-transparent border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={token0Amount}
                                                // onChange={handleToken0AmountChange}
                                                onChange={(e) => handleToken0Change(e.target.value)}
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
                                            className="rounded-full bg-gray-800 hover:bg-gray-700 border-4 border-[#0d0d0d]"
                                            onClick={handleSwap}
                                        >
                                            <FlipHorizontalIcon className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    {/* Token 1 Input */}
                                    <div className="bg-gray-900 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2 rounded-full px-3 py-1 cursor-pointer">
                                                <Image
                                                    src={daoToken?.symbol === token1 ? CURRENT_DAO_IMAGE : ModeTokenLogo}
                                                    alt="Token logo"
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                                <span className="font-medium">{token1}</span>
                                            </div>
                                            <Input
                                                type="number"
                                                placeholder="0.0"
                                                className="text-right text-2xl bg-transparent border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={token1Amount}
                                                // onChange={(e) => setToken1Amount(e.target.value)}
                                                onChange={(e) => handleToken1Change(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pool Info */}
                                <div className="bg-gray-900 p-4 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Exchange Rate</span>
                                        <span>1 {token0} = 3200 {token1}</span>
                                    </div>
                                </div>

                                {/* Price Range Selection */}
                                <div className="bg-gray-900 p-4 rounded-xl space-y-4">
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

                                    <div className={`overflow-hidden transition-all duration-300 ${isPriceRangeOpen ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="space-y-4 pt-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                {['0.1', '3', '5'].map((range) => (
                                                    <Button
                                                        key={range}
                                                        variant={selectedRange === range ? 'default' : 'outline'}
                                                        className={`text-sm ${selectedRange === range ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                                        onClick={() => {
                                                            setSelectedRange(range);
                                                            setCustomRange('');
                                                        }}
                                                    >
                                                        ±{range}%
                                                    </Button>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Custom"
                                                    className="flex-1 bg-gray-800 border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    value={customRange}
                                                    onChange={(e) => {
                                                        setCustomRange(e.target.value);
                                                        setSelectedRange('');
                                                    }}
                                                />
                                                <span className="text-gray-400 text-sm">%</span>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {selectedRange ? `Your liquidity will be concentrated between ±${selectedRange}%` :
                                                    customRange ? `Custom range set to ±${customRange}%` : 'Select a price range'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Slippage Tolerance */}
                                <div className="space-y-4">
                                    {/* Settings Trigger */}
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsSlippageSettingsOpen(!isSlippageSettingsOpen)}>
                                        <span className="text-sm">Slippage Tolerance</span>
                                        <svg
                                            className={`w-5 h-5 transition-transform ${isSlippageSettingsOpen ? 'rotate-90' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>

                                    {/* Collapsible Content */}
                                    <div className={`overflow-hidden transition-all duration-300 ${isSlippageSettingsOpen ? 'max-h-40' : 'max-h-0'}`}>
                                        <div className="bg-gray-900 p-4 rounded-xl space-y-4">
                                            <div className="grid grid-cols-3 gap-2">
                                                {['0.1', '0.5', '1'].map((slippage) => (
                                                    <Button
                                                        key={slippage}
                                                        variant={slippageTolerance === slippage ? 'default' : 'outline'}
                                                        className={`text-sm ${slippageTolerance === slippage ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                                        onClick={() => {
                                                            setSlippageTolerance(slippage);
                                                            setCustomSlippage('');
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
                                                    className="flex-1 bg-gray-800 border-0 focus-visible:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    value={customSlippage}
                                                    onChange={(e) => {
                                                        setCustomSlippage(e.target.value);
                                                        setSlippageTolerance('');
                                                    }}
                                                />
                                                <span className="text-gray-400 text-sm">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Liquidity Button */}
                                <Button
                                    className="w-full py-6 text-lg bg-white text-black hover:bg-gray-100 rounded-xl"
                                    onClick={async () => {
                                        const effectiveSlippage = customSlippage || slippageTolerance;
                                        const slippageBips = Math.floor(Number(effectiveSlippage) * 100);

                                        // Use slippageBips in your transaction parameters
                                        // Example: 
                                        // const amountMin = amount.mul(10000 - slippageBips).div(10000);
                                        // Then pass amountMin to your contract call
                                    }}
                                >
                                    Add Liquidity
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default Liquidity