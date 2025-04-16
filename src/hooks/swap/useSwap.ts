import { chainsData } from '@/constants/chains';
import { getDexAddressesForChain } from '@/constants/dex';
import { getQuotes, getSwapData } from '@/helpers/swap';
import { DaoInfo, FundDetails } from '@/types/daao';
import { PoolDetails } from '@/types/pool';
import { getPublicClient } from '@/utils/publicClient';
import { getMinAmount } from '@/utils/slippage';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { erc20Abi, Hex } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useWriteContract } from 'wagmi';

export const useSwap = ({ chainId, fundDetails }: { chainId: number; fundDetails: FundDetails }) => {
  // states
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [toAmount, setToAmount] = useState<bigint>(BigInt(0));
  const [isSwapping, setIsSwapping] = useState(false);
  const [daoInfo, setDaoInfo] = useState<DaoInfo | null>(null);
  const [poolDetails, setPoolDetails] = useState<PoolDetails | null>(null);
  const [sellTokenBalance, setSellTokenBalance] = useState<bigint>(BigInt(0));

  // hooks
  const { address: accountAddress, chainId: accountChainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  // constants

  const account = accountAddress as Hex;
  const minSqrtPrice = '4295128750';
  const maxSqrtPrice = '1461446703485210103287273052203988822378723970300';
  const sellToken = activeTab === 'buy' ? daoInfo?.paymentTokenDetails : daoInfo?.daoTokenDetails;
  const buyToken = activeTab === 'buy' ? daoInfo?.daoTokenDetails : daoInfo?.paymentTokenDetails;
  const slippage = 1; // 1% slippage
  const zeroToOne = sellToken?.address === poolDetails?.token0;
  const dexDetails = getDexAddressesForChain(chainId, fundDetails.dexInfo.type);

  const fetchSellTokenBalance = async () => {
    if (!account || !daoInfo) return;
    const sellToken = activeTab === 'buy' ? daoInfo?.paymentTokenDetails : daoInfo?.daoTokenDetails;
    if (!sellToken) return;
    const publicClient = getPublicClient(chainId);
    const balance = await publicClient.readContract({
      address: sellToken.address as Hex,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account],
    });
    setSellTokenBalance(balance);
  };

  const fetchSellTokenBalanceWithRetry = async (retries: number = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await fetchSellTokenBalance();
        return;
      } catch (error) {
        if (i === retries - 1) {
          console.error('Error fetching payment token balance:', error);
          toast.error('Error fetching payment token balance');
        }
      }
    }
  };

  const approveSellToken = async (amount: bigint) => {
    const publicClient = getPublicClient(chainId);
    const spender = dexDetails.swapRouterAddress;
    if (!sellToken) return;
    const allowance = await publicClient.readContract({
      address: sellToken.address as Hex,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, spender],
    });
    if (BigInt(allowance) >= amount) {
      return;
    }
    const tx = await writeContractAsync({
      address: sellToken.address,
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

  async function fetchQuotes(amount: bigint) {
    if (!window.ethereum || !poolDetails?.address || !daoInfo) return;
    try {
      if (!amount) {
        toast.error('No amount specified');
        return;
      }
      if (amount > sellTokenBalance) {
        toast.error('Insufficient balance');
        return;
      }

      let amountOut = await getQuotes({
        poolAddress: poolDetails.address,
        amount,
        chainId,
        sqrtPrice: zeroToOne ? BigInt(minSqrtPrice) : BigInt(maxSqrtPrice),
        zeroToOne,
        type: fundDetails.dexInfo.type,
        fee: fundDetails.dexInfo.fee,
        tokenIn: sellToken?.address as Hex,
        tokenOut: buyToken?.address as Hex,
      });

      if (amountOut < 0) {
        amountOut = amountOut * BigInt(-1);
      }
      setToAmount(amountOut);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      toast.error('Error fetching quotes');
      setToAmount(BigInt(0));
    }
  }

  async function handleSwap(amount: bigint) {
    try {
      setIsSwapping(true);

      if (!account) {
        toast.error('No wallet connected');
        return;
      }

      if (!amount) {
        toast.error('No amount specified');
        return;
      }

      if (!buyToken || !sellToken) {
        toast.error('No token found');
        return;
      }

      if (amount > sellTokenBalance) {
        toast.error('Insufficient balance');
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

      await approveSellToken(amount);
      const minAmount = getMinAmount(toAmount, slippage);
      const publicClient = getPublicClient(chainId);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5); // 5 minutes from now

      const { callData, to, value } = await getSwapData({
        amount,
        chainId,
        deadline,
        minAmount,
        poolAddress: poolDetails?.address!,
        sqrtPrice: zeroToOne ? BigInt(minSqrtPrice) : BigInt(maxSqrtPrice),
        type: fundDetails.dexInfo.type,
        zeroToOne,
        tokenIn: sellToken?.address as Hex,
        tokenOut: buyToken?.address as Hex,
        fee: fundDetails.dexInfo.fee,
        recipient: account,
      });

      const hash = await sendTransactionAsync({
        account,
        to,
        value,
        data: callData,
        chainId,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (receipt?.status !== 'success') {
        throw new Error('Swap transaction did not succeed');
      }
      toast.success('Swap/Buy successful');
      fetchSellTokenBalanceWithRetry();
    } catch (error) {
      console.error('Error during swap:', error);
      toast.error('Error during swap');
    } finally {
      setIsSwapping(false);
      setToAmount(BigInt(0));
      fetchSellTokenBalanceWithRetry();
    }
  }

  useEffect(() => {
    if (!account) return;
    setToAmount(BigInt(0));
  }, [account]);

  useEffect(() => {
    if (daoInfo) {
      fetchSellTokenBalanceWithRetry();
    }
  }, [daoInfo, account, activeTab]);

  return {
    activeTab,
    isSwapping,
    daoInfo,
    sellToken,
    buyToken,
    isLoading,
    sellTokenBalance,
    setPoolDetails,
    toAmount,
    setActiveTab,
    handleSwap,
    fetchQuotes,
    fetchSellTokenBalance: fetchSellTokenBalanceWithRetry,
    setToAmount,
    setIsLoading,
    approveSellToken,
    setSellTokenBalance,
    setDaoInfo,
    setIsSwapping,
  };
};
