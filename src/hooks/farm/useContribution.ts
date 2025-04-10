import { chainsData } from '@/constants/chains';
import { CARTEL } from '@/daao-sdk/abi/cartel';
import { DAAO_CONTRACT_ABI } from '@/daao-sdk/abi/daao';
import { fetchDaoInfo, fetchTierLimits, fetchUserContributionInfo } from '@/helpers/contribution';
import { FundDetails } from '@/types/daao';
import { handleViemTransactionError } from '@/utils/approval';
import { getPublicClient } from '@/utils/publicClient';
import { getLocalTokenDetails } from '@/utils/token';
import { useState } from 'react';
import { toast as reactToast } from 'react-toastify';
import { toast } from 'sonner';
import { Abi, erc20Abi, Hex } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';

const useContribution = ({ chainId, fundDetails }: { chainId: number; fundDetails: FundDetails }) => {
  const { address: account, chainId: accountChainId } = useAccount();
  const publicClient = getPublicClient(chainId);
  const { switchChainAsync } = useSwitchChain();
  const tokenDetails = getLocalTokenDetails({
    address: fundDetails.token,
    chainId,
  });
  const { writeContractAsync } = useWriteContract();
  const [approvalTxHash, setApprovalTxHash] = useState<Hex | undefined>(undefined);

  const checkAllowance = async (requiredAmount: bigint): Promise<boolean> => {
    if (!account) return false;
    try {
      const allowance = await publicClient.readContract({
        address: fundDetails.token,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account, fundDetails.address],
      });
      return BigInt(allowance as bigint) >= BigInt(requiredAmount);
    } catch (err) {
      console.error('checkAllowance error:', err);
      return false;
    }
  };

  const requestAllowance = async ({ amount, token }: { amount: bigint; token: Hex }): Promise<Hex | undefined> => {
    if (!account) return undefined;
    try {
      const tx = await writeContractAsync({
        address: token,
        abi: erc20Abi,
        functionName: 'approve',
        args: [fundDetails.address, amount],
      });
      if (!tx) throw new Error('Approval transaction failed to send');
      setApprovalTxHash(tx);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });
      if (receipt?.status !== 'success') {
        throw new Error('Approval transaction did not succeed');
      }
      return tx;
    } catch (err: any) {
      console.error('Approval error:', err);
      const { errorMsg } = handleViemTransactionError({
        abi: CARTEL as Abi,
        error: err,
      });
      reactToast.error(errorMsg);
      return undefined;
    }
  };

  const getDaoInfo = async () => {
    return fetchDaoInfo({
      daoAddress: fundDetails.address,
      chainId,
    });
  };

  const getUserContributionInfo = async () => {
    return fetchUserContributionInfo({
      account,
      daoAddress: fundDetails.address,
      chainId,
      tokenDecimals: tokenDetails.decimals,
    });
  };

  const contribute = async (amount: bigint) => {
    try {
      if (!account) {
        reactToast.error('No wallet connected');
        return undefined;
      }

      if (accountChainId !== chainId) {
        if (accountChainId !== chainId) {
          try {
            await switchChainAsync({ chainId });
          } catch (error) {
            console.error('Error switching chain:', error);
            toast.error(`Please switch to ${chainsData[chainId].slug} network to proceed`);
            return;
          }
        }
      }

      const txHash = await writeContractAsync({
        address: fundDetails.address,
        abi: DAAO_CONTRACT_ABI,
        functionName: 'contribute',
        args: [amount],
        value: amount,
      });

      const txnReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });

      if (txnReceipt?.status !== 'success') {
        reactToast.error('Contribution failed');
        return undefined;
      }

      reactToast.success('Your Contribution was Successful');
      return txHash;
    } catch (err) {
      console.error('Contribution error:', err);
      reactToast.error('Contribution failed');
      return undefined;
    }
  };

  const contributeWithToken = async (amount: bigint) => {
    try {
      if (!account) {
        reactToast.error('No wallet connected');
        return undefined;
      }

      if (accountChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      let allowanceSufficient = await checkAllowance(amount);
      if (!allowanceSufficient) {
        await requestAllowance({ amount, token: fundDetails.token });
        allowanceSufficient = await checkAllowance(amount);
        if (!allowanceSufficient) {
          throw new Error('Approval failed');
        }
      }

      const txHash = await writeContractAsync({
        address: fundDetails.address,
        abi: DAAO_CONTRACT_ABI,
        functionName: 'contribute',
        args: [amount],
      });

      const txnReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
      });

      if (txnReceipt?.status !== 'success') {
        reactToast.error('Contribution failed');
        return undefined;
      }

      reactToast.success('Your Contribution was Successful');
      return txHash;
    } catch (err) {
      console.error('Token contribution error:', err);
      reactToast.error('Contribution failed');
      return undefined;
    }
  };

  const getTierLimits = async (tier: number) => {
    return fetchTierLimits({
      tier,
      chainId,
      daoAddress: fundDetails.address,
    });
  };

  return { getDaoInfo, contribute, getTierLimits, contributeWithToken, getUserContributionInfo };
};

export default useContribution;
