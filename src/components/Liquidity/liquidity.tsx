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
import { daoAddress, modeTokenAddress, tickSpacing, veloFactoryAddress, nonFungiblePositionManagerAddress } from '@/common/common'
import VELO_FACTORY_ABI from '@/lib/abis/veloAbi.json'
import velodromeFactoryABI from "../../veloABI.json"


const Liquidity = () => {

    const MODE_TOKEN_ADDRESS = modeTokenAddress;
    const TICK_SPACING = tickSpacing;
    const DAO_TOKEN_ADDRESS = daoAddress || process.env.NEXT_PUBLIC_DAO_ADDRESS;
    const VELO_FACTORY_ADDRESS = veloFactoryAddress || process.env.NEXT_PUBLIC_VELO_FACTORY_ADDRESS;
    const NON_FUNGIBLE_POSITION_MANAGER_ADDRESS = nonFungiblePositionManagerAddress || process.env.NEXT_PUBLIC_NON_FUNGIBLE_POSITION_MANAGER_ADDRESS;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token0Amount, setToken0Amount] = useState('');
    const [token1Amount, setToken1Amount] = useState('');
    const [token0, setToken0] = useState('CARTEL');
    const [token1, setToken1] = useState('MODE');
    const [selectedRange, setSelectedRange] = useState('1');
    const [customRange, setCustomRange] = useState('');
    const [daoToken, setDaoToken] = useState<{
        address: string;
        symbol: string;
        name: string;
    } | null>(null);
    const [token0Address, setToken0Address] = useState('');
    const [token0Decimals, setToken0Decimals] = useState(18);
    const [poolAddress, setPoolAddress] = useState<string>('');

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


    console.log(poolAddress, "poolAddress");

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
                                                onChange={(e) => setToken0Amount(e.target.value)}
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
                                                onChange={(e) => setToken1Amount(e.target.value)}
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
                                    <h3 className="text-sm font-medium">Select Price Range</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['0.1', '1', '5'].map((range) => (
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

                                {/* Add Liquidity Button */}
                                <Button
                                    className="w-full py-6 text-lg bg-white  text-black hover:bg-gray-100 rounded-xl"
                                    onClick={() => {/* Add liquidity logic here */ }}
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