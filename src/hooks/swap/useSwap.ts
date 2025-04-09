import { chainsData } from '@/config/chains';
import { ROUTER_ABI } from '@/daao-sdk/abi/router';
import { SWAP_QUOTER_SIMULATE } from '@/daao-sdk/abi/swapQuoterAbi';
import { fetchDaoInfo } from '@/helpers/contribution';
import { findPoolAddress, findPoolDetails } from '@/helpers/pool';
import { DaoInfo, FundDetails } from '@/types/daao';
import { getPublicClient } from '@/utils/publicClient';
import { getMinAmount } from '@/utils/slippage';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { erc20Abi, Hex } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';

export const useSwap = ({ chainId, fundDetails }: { chainId: number; fundDetails: FundDetails }) => {
  // states
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [token0, setToken0] = useState<Hex | null>(null);
  const [token1, setToken1] = useState<Hex | null>(null);
  const [toAmount, setToAmount] = useState<bigint>(BigInt(0));
  const [isSwapping, setIsSwapping] = useState(false);
  const [daoInfo, setDaoInfo] = useState<DaoInfo | null>(null);
  const [poolAddress, setPoolAddress] = useState<Hex | null>(null);
  const [sellTokenBalance, setSellTokenBalance] = useState<bigint>(BigInt(0));

  // hooks
  const { address: accountAddress, chainId: accountChainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  // constants

  const account = accountAddress as Hex;
  const minSqrtPrice = '4295128750';
  const maxSqrtPrice = '1461446703485210103287273052203988822378723970300';
  const chainInfo = chainsData[chainId];
  const sellToken = activeTab === 'buy' ? daoInfo?.paymentTokenDetails : daoInfo?.daoTokenDetails;
  const buyToken = activeTab === 'buy' ? daoInfo?.daoTokenDetails : daoInfo?.paymentTokenDetails;
  const slippage = 1; // 1% slippage
  const zeroToOne = sellToken?.address === token0;
  // functions

  const fetchDaoInfoAndPoolAddress = async () => {
    try {
      setIsLoading(true);
      const daoDetails = await fetchDaoInfo({
        chainId,
        daoAddress: fundDetails.address,
        useWnativeToken: true,
      });
      if (daoDetails) {
        setDaoInfo(daoDetails);

        //TODO: dynamic fee and tick spacing
        const poolAddress = await findPoolAddress({
          chainId,
          fee: 10000,
          token0: daoDetails.paymentToken,
          token1: daoDetails.daoToken,
          tickSpacing: 100,
          type: chainInfo.dexInfo.type,
        });
        const poolDetails = await findPoolDetails({
          address: poolAddress,
          chainId,
        });
        setToken0(poolDetails.token0);
        setToken1(poolDetails.token1);
        setPoolAddress(poolAddress);
      }
    } catch (error) {
      console.error('Error fetching DAO info and pool address:', error);
      toast.error('Error fetching DAO info and pool address');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellTokenBalance = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching payment token balance:', error);
    }
  };

  const approveSellToken = async (amount: bigint) => {
    const publicClient = getPublicClient(chainId);
    const spender = chainInfo.dexInfo.swapRouterAddress;
    const sellToken = activeTab === 'buy' ? daoInfo?.paymentTokenDetails : daoInfo?.daoTokenDetails;
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
    if (!window.ethereum || !poolAddress || !daoInfo) return;
    try {
      if (!amount) {
        toast.error('No amount specified');
        return;
      }
      if (amount > sellTokenBalance) {
        toast.error('Insufficient balance');
        return;
      }

      const publicClient = getPublicClient(chainId);

      let amountOut = (
        await publicClient.simulateContract({
          address: chainInfo.dexInfo.quoterAddress,
          abi: SWAP_QUOTER_SIMULATE,
          functionName: 'quoteExactInputSingle',
          args: [poolAddress, zeroToOne, amount, zeroToOne ? BigInt(minSqrtPrice) : BigInt(maxSqrtPrice)],
        })
      ).result;

      if (amountOut < 0) {
        amountOut = amountOut * BigInt(-1);
      }
      setToAmount(amountOut);
    } catch (err) {
      console.error('Error simulating swap:', err);
      toast.error('Error simulating swap');
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
        await switchChainAsync({ chainId });
      }

      await approveSellToken(amount);
      const minAmount = getMinAmount(toAmount, slippage);
      const publicClient = getPublicClient(chainId);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5); // 5 minutes from now

      const args = [
        poolAddress,
        zeroToOne,
        amount,
        zeroToOne ? BigInt(minSqrtPrice) : BigInt(maxSqrtPrice),
        minAmount,
        deadline,
      ] as const;

      const estimatedGas = await publicClient.estimateContractGas({
        abi: ROUTER_ABI,
        address: chainInfo.dexInfo.swapRouterAddress,
        functionName: 'getSwapResult',
        args: args,
        account,
      });

      const tx = await writeContractAsync({
        abi: ROUTER_ABI,
        address: chainInfo.dexInfo.swapRouterAddress,
        functionName: 'getSwapResult',
        args,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      if (receipt?.status !== 'success') {
        throw new Error('Swap transaction did not succeed');
      }
      toast.success('Swap/Buy successful');

      fetchSellTokenBalance();
    } catch (error) {
      console.error('Error during swap:', error);
    } finally {
      setIsSwapping(false);
      setToAmount(BigInt(0));
      fetchSellTokenBalance();
    }
  }

  useEffect(() => {
    if (!account) return;
    fetchDaoInfoAndPoolAddress();
    setToAmount(BigInt(0));
  }, [chainId, account]);

  useEffect(() => {
    if (daoInfo) {
      fetchSellTokenBalance();
    }
  }, [daoInfo, account, activeTab]);

  return {
    activeTab,
    isSwapping,
    daoInfo,
    sellToken,
    buyToken,
    isLoading,
    poolAddress,
    sellTokenBalance,
    toAmount,
    setActiveTab,
    fetchDaoInfoAndPoolAddress,
    handleSwap,
    fetchQuotes,
    fetchSellTokenBalance,
    setToAmount,
    setIsLoading,
    approveSellToken,
    setSellTokenBalance,
    setDaoInfo,
    setPoolAddress,
    setIsSwapping,
  };
};
