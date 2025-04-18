import { chainsData } from '@/constants/chains';
import { getDexAddressesForChain } from '@/constants/dex';
import { generateAddLiquidityCallData } from '@/helpers/addLiquidity';
import { getPoolSlot0 } from '@/helpers/pool';
import { getTokensBalance } from '@/helpers/token';
import { DaoInfo, FundDetails } from '@/types/daao';
import { PoolDetails } from '@/types/pool';
import { getPublicClient } from '@/utils/publicClient';
import { getMinAmount } from '@/utils/slippage';
import { V3PoolUtils } from '@/utils/v3Pools';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { erc20Abi, Hex, parseUnits } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useWriteContract } from 'wagmi';
import useEffectAfterMount from './useEffectAfterMount';

type CurrentPoolData = {
  tick: number;
  sqrtPriceX96: bigint;
};

const getPriceFromPercent = (percent: number, currentPrice: number) => {
  return currentPrice * (1 + percent / 100);
};

export const useAddLiquidity = ({
  fundDetails,
  daoInfo,
  poolDetails,
  chainId,
}: {
  fundDetails: FundDetails;
  daoInfo: DaoInfo;
  poolDetails: PoolDetails;
  chainId: number;
}) => {
  const [srcTokenFormattedAmount, setSrcTokenFormattedAmount] = useState('');
  const [dstTokenFormattedAmount, setDstTokenFormattedAmount] = useState('');
  const [balances, setBalances] = useState<{ [key: string]: bigint }>({});
  const [selectedRange, setSelectedRange] = useState(25);
  const [slippageTolerance, setSlippageTolerance] = useState(1);
  const [srcToken, setSrcToken] = useState<'token0' | 'token1'>('token0');
  const [lowerPrice, setLowerPrice] = useState(0);
  const [upperPrice, setUpperPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lowerTick, setLowerTick] = useState(0);
  const [upperTick, setUpperTick] = useState(0);
  const [currentPoolData, setCurrentPoolData] = useState<CurrentPoolData>({
    tick: 0,
    sqrtPriceX96: 0n,
  });

  const [txnInProgress, setTxnInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const { address: account, chainId: accountChainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  const token0Details = poolDetails.token0 === daoInfo.daoToken ? daoInfo.daoTokenDetails : daoInfo.paymentTokenDetails;
  const token1Details = poolDetails.token1 === daoInfo.daoToken ? daoInfo.daoTokenDetails : daoInfo.paymentTokenDetails;
  const srcTokenDetails = srcToken === 'token0' ? token0Details : token1Details;
  const destTokenDetails = srcToken === 'token0' ? token1Details : token0Details;
  const nftManagerAddress = getDexAddressesForChain(chainId, fundDetails.dexInfo.type).nftManager;

  const updateCurrentPoolData = async () => {
    try {
      setIsDataLoading(true);
      const { currentTick, sqrtPriceX96 } = await getPoolSlot0({
        address: poolDetails.address,
        chainId,
        type: fundDetails.dexInfo.type,
      });

      setCurrentPoolData({
        tick: currentTick,
        sqrtPriceX96,
      });
      updateCurrentPrice(sqrtPriceX96);

      return {
        currentTick,
        sqrtPriceX96,
      };
    } catch (error) {
      console.error('Error fetching pool data:', error);
      setError('Failed to fetch pool data');
    } finally {
      setIsDataLoading(false);
    }
  };

  const updateTicks = () => {
    const currentPrice = V3PoolUtils.getPriceFromSqrtRatio({
      decimal0: token0Details.decimals,
      decimal1: token1Details.decimals,
      sqrtPriceX96: currentPoolData.sqrtPriceX96,
    });
    const lowerPrice = getPriceFromPercent(-selectedRange, currentPrice);
    const upperPrice = getPriceFromPercent(selectedRange, currentPrice);
    const lowerTick = V3PoolUtils.nearestUsableTick({
      tick: V3PoolUtils.getTickFromPrice({
        decimal0: token0Details.decimals,
        decimal1: token1Details.decimals,
        price: lowerPrice,
        tickSpacing: fundDetails.dexInfo.tickSpacing,
      }),
      tickSpacing: fundDetails.dexInfo.tickSpacing,
    });

    const upperTick = V3PoolUtils.nearestUsableTick({
      tick: V3PoolUtils.getTickFromPrice({
        decimal0: token0Details.decimals,
        decimal1: token1Details.decimals,
        price: upperPrice,
        tickSpacing: fundDetails.dexInfo.tickSpacing,
      }),
      tickSpacing: fundDetails.dexInfo.tickSpacing,
    });
    setLowerTick(lowerTick);
    setUpperTick(upperTick);
    updateLowerPrice(lowerTick);
    updateUpperPrice(upperTick);
  };

  const fetchInitialData = async () => {
    try {
      await updateCurrentPoolData();
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const updateLowerPrice = (tickLower: number) => {
    const price = V3PoolUtils.getPriceFromTick({
      decimal0: token0Details.decimals,
      decimal1: token1Details.decimals,
      tick: tickLower,
    });
    if (srcToken === 'token1') {
      setLowerPrice(1 / price);
      return 1 / price;
    }
    setLowerPrice(price);
  };

  const updateUpperPrice = (tickUpper: number) => {
    const price = V3PoolUtils.getPriceFromTick({
      decimal0: token0Details.decimals,
      decimal1: token1Details.decimals,
      tick: tickUpper,
    });
    if (srcToken === 'token1') {
      setUpperPrice(1 / price);
      return 1 / price;
    }
    setUpperPrice(price);
  };

  const updateCurrentPrice = (sqrtPrice: bigint) => {
    const currentPrice = V3PoolUtils.getPriceFromSqrtRatio({
      decimal0: token0Details.decimals,
      decimal1: token1Details.decimals,
      sqrtPriceX96: sqrtPrice,
    });
    if (srcToken === 'token0') {
      setCurrentPrice(currentPrice);
      return currentPrice;
    } else {
      setCurrentPrice(1 / currentPrice);
      return 1 / currentPrice;
    }
  };

  const getDstTokenAmount = (formattedSrcAmount: string) => {
    if (!Number(formattedSrcAmount)) return '0';
    if (srcToken === 'token0') {
      return V3PoolUtils.getToken1Amount({
        decimal0: token0Details.decimals,
        decimal1: token1Details.decimals,
        formattedToken0Amount: Number(formattedSrcAmount),
        lowerTick,
        sqrtPriceX96: currentPoolData.sqrtPriceX96,
        upperTick,
      });
    }
    return V3PoolUtils.getToken0Amount({
      decimal0: token0Details.decimals,
      decimal1: token1Details.decimals,
      formattedToken1Amount: Number(formattedSrcAmount),
      lowerTick,
      sqrtPriceX96: currentPoolData.sqrtPriceX96,
      upperTick,
    });
  };

  const updateTokensBalance = async () => {
    if (!account) return;
    const balance = await getTokensBalance([srcTokenDetails.address, destTokenDetails.address], chainId, account);
    setBalances(balance);
    return balance;
  };

  const approveToken = async (amount: bigint, token: Hex) => {
    if (!account) return;
    const publicClient = getPublicClient(chainId);
    const spender = nftManagerAddress;
    const allowance = await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, spender],
    });
    if (BigInt(allowance) >= amount) {
      return;
    }
    const tx = await writeContractAsync({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
    });
    if (!tx) throw new Error('Approval transaction failed to send');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
      confirmations: 1,
    });
    if (receipt?.status !== 'success') {
      throw new Error('Approval transaction did not succeed');
    }
    return tx;
  };

  const handleAddLiquidity = async () => {
    try {
      if (!account || !accountChainId) {
        toast.error('Please connect wallet to proceed');
        return;
      }

      if (accountChainId !== chainId) {
        try {
          await switchChainAsync({ chainId });
        } catch (error) {
          console.error('Error switching chain:', error);
          toast.error(`Please switch to ${chainsData[chainId].slug} network to proceed`);
          return;
        }
      }

      if (!Number(srcTokenFormattedAmount) || !Number(dstTokenFormattedAmount)) {
        toast.error('Please enter valid amounts');
        return;
      }

      const amount0 =
        srcToken === 'token0'
          ? parseUnits(srcTokenFormattedAmount, srcTokenDetails.decimals)
          : parseUnits(dstTokenFormattedAmount, destTokenDetails.decimals);
      const amount1 =
        srcToken === 'token0'
          ? parseUnits(dstTokenFormattedAmount, destTokenDetails.decimals)
          : parseUnits(srcTokenFormattedAmount, srcTokenDetails.decimals);

      if (amount0 > balances[poolDetails.token0] || amount1 > balances[poolDetails.token1]) {
        toast.error('Not enough balance');
        return;
      }

      setTxnInProgress(true);

      await approveToken(amount0, poolDetails.token0);
      await approveToken(amount1, poolDetails.token1);

      const callData = generateAddLiquidityCallData({
        data: {
          amount0Desired: amount0,
          amount1Desired: amount1,
          amount0Min: getMinAmount(amount0, Number(slippageTolerance)),
          amount1Min: getMinAmount(amount1, Number(slippageTolerance)),
          deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 5), // 5 minutes from now
          fee: fundDetails.dexInfo.fee,
          recipient: account,
          sqrtPriceX96: currentPoolData.sqrtPriceX96,
          tickLower: lowerTick,
          tickSpacing: fundDetails.dexInfo.tickSpacing,
          tickUpper: upperTick,
          token0: poolDetails.token0,
          token1: poolDetails.token1,
        },
        type: fundDetails.dexInfo.type,
      });

      const hash = await sendTransactionAsync({
        account,
        to: nftManagerAddress,
        value: 0n,
        data: callData,
        chainId,
      });
      const publicClient = getPublicClient(chainId);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (receipt?.status !== 'success') {
        throw new Error('Swap transaction did not succeed');
      }
      toast.success('Liquidity added successfully');
      updateTokensBalance();
      setSrcTokenFormattedAmount('');
      setDstTokenFormattedAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed');
    } finally {
      setTxnInProgress(false);
    }
  };

  useEffectAfterMount(() => {
    updateTicks();
  }, [selectedRange, currentPoolData]);

  useEffectAfterMount(() => {
    if (!Number(srcTokenFormattedAmount)) {
      setDstTokenFormattedAmount('');
      return;
    }
    setDstTokenFormattedAmount(getDstTokenAmount(srcTokenFormattedAmount));
  }, [lowerTick, upperTick, currentPoolData, srcTokenFormattedAmount]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    updateTokensBalance();
  }, [account]);

  useEffectAfterMount(() => {
    updateLowerPrice(lowerTick);
    updateUpperPrice(upperTick);
  }, [srcToken]);

  const handleSwitch = () => {
    if (srcToken === 'token0') {
      setSrcToken('token1');
    } else {
      setSrcToken('token0');
    }
    setSrcTokenFormattedAmount('');
    setDstTokenFormattedAmount('');
  };

  return {
    lowerTick,
    upperTick,
    srcTokenDetails,
    destTokenDetails,
    srcTokenFormattedAmount,
    setSrcTokenFormattedAmount,
    dstTokenFormattedAmount,
    getDstTokenAmount,
    setDstTokenFormattedAmount,
    selectedRange,
    isDataLoading,
    setSelectedRange,
    slippageTolerance,
    setSlippageTolerance,
    srcToken,
    txnInProgress,
    setSrcToken,
    handleSwitch,
    handleAddLiquidity,
    currentPoolData,
    token0Details,
    token1Details,
    lowerPrice,
    upperPrice,
    currentPrice,
    error,
    approvalStatus,
  };
};
