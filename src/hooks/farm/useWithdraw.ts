import { chainsData } from '@/constants/chains';
import { FARM_ABI } from '@/daao-sdk/abi/farm';
import { POOL_ABI } from '@/daao-sdk/abi/pool';
import { handleViemTransactionError } from '@/utils/approval';
import { getPublicClient } from '@/utils/publicClient';
import { toast as reactToast } from 'react-toastify';
import { Abi, Hex } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';

const useWithDraw = ({ chainId }: { chainId: number }) => {
  const { writeContractAsync } = useWriteContract();
  const publicClient = getPublicClient(chainId);
  const { switchChainAsync } = useSwitchChain();
  const { chainId: accountChainId } = useAccount();

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

  const withdraw = async ({ poolAddress, amount }: { poolAddress: Hex; amount: bigint }) => {
    try {
      await switchChain();
      reactToast.success('Processing Withdrawal...');

      const withdrawResponse = await writeContractAsync({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: 'withdraw',
        args: [amount],
      });
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: withdrawResponse,
      });
      if (receipt.status !== 'success') {
        reactToast.error('Transaction failed');
        throw new Error('Transaction failed');
      }
      reactToast.success('Withdrawal Successful ✅');
    } catch (error) {
      console.log({ error });
      const { errorMsg } = handleViemTransactionError({
        abi: POOL_ABI as Abi,
        error,
      });

      reactToast.error('Withdrawal Failed ❌, ' + errorMsg);
    }
  };

  const startWithdraw = async ({ poolAddress }: { poolAddress: Hex }) => {
    try {
      await switchChain();
      reactToast.success('Initiating Withdrawal...');

      const startWithdrawResponse = await writeContractAsync({
        address: poolAddress,
        abi: FARM_ABI,
        functionName: 'startWithdraw',
      });

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: startWithdrawResponse,
        confirmations: 1,
      });

      if (receipt?.status === 'success') {
        reactToast.success('Withdrawal Initiated');
      } else {
        reactToast.error('Withdrawal Initiation Failed');
      }
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

  const getWithdrawalTime = async ({ address, poolAddress }: { address: Hex; poolAddress: Hex }) => {
    try {
      const withdrawalTime = await publicClient.readContract({
        address: poolAddress,
        abi: FARM_ABI,
        functionName: 'withdrawalTime',
        args: [address],
      });
      // const withdrawalTime = BigInt(1743311984);
      if (!withdrawalTime || Number(withdrawalTime) === 0) return 'Not Initiated';

      const currentTime = BigInt(Math.floor(Date.now() / 1000));

      if (BigInt(withdrawalTime) > currentTime) {
        const remainingTime = BigInt(withdrawalTime) - currentTime;
        const days = Math.floor(Number(remainingTime) / (60 * 60 * 24));
        const hours = Math.floor((Number(remainingTime) % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((Number(remainingTime) % (60 * 60)) / 60);
        return `${days} days, ${hours} hours, ${minutes} minutes`;
      }

      return 'Available Now';
    } catch (error) {
      console.log({ error });
      const { errorMsg } = handleViemTransactionError({
        abi: FARM_ABI as Abi,
        error,
      });

      reactToast.error(errorMsg);

      return 'Unknown Time';
    }
  };

  return { withdraw, startWithdraw, getWithdrawalTime };
};

export default useWithDraw;
