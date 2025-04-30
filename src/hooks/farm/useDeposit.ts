import { chainsData } from '@/constants/chains';
import { POOL_ABI } from '@/daao-sdk/abi/pool';
import { handleViemTransactionError } from '@/utils/approval';
import { getPublicClient } from '@/utils/publicClient';
import { toast as reactToast, toast } from 'react-toastify'; // Ensure to import react-toastify's toast function
import { Abi, erc20Abi, Hex } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';

const useDeposit = ({ chainId }: { chainId: number }) => {
  const publicClient = getPublicClient(chainId);
  const { address: account, chainId: accountChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const switchChain = async () => {
    if (accountChainId !== chainId) {
      try {
        await switchChainAsync({ chainId });
      } catch (error) {
        console.error('Error switching chain:', error);
        reactToast.error(`Please switch to ${chainsData[chainId].slug} network to proceed`);
        return;
      }
    }
  };

  const approveToken = async ({ amount, spender, token }: { amount: bigint; spender: Hex; token: Hex }) => {
    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    await switchChain();
    const publicClient = getPublicClient(chainId);
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
    toast.success('Token approved successfully');
    return tx;
  };

  const deposit = async ({
    tokenAddress,
    poolAddress,
    amount,
  }: {
    tokenAddress: Hex;
    poolAddress: `0x${string}`;
    amount: bigint;
  }) => {
    try {
      if (!account) {
        toast.error('Please connect your wallet');
        return;
      }
      await approveToken({
        amount,
        spender: poolAddress,
        token: tokenAddress,
      });
      const tx = await writeContractAsync({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: 'deposit',
        args: [amount],
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      if (receipt?.status !== 'success') {
        toast.error('Deposit transaction failed');
        throw new Error('Deposit transaction did not succeed');
      }
      toast.success('Deposit successful');
      return receipt;
    } catch (error) {
      console.log({ error });
      const { errorMsg } = handleViemTransactionError({
        abi: POOL_ABI as Abi,
        error,
      });
      reactToast.error(errorMsg);
    }
  };

  return { deposit };
};
export default useDeposit;
