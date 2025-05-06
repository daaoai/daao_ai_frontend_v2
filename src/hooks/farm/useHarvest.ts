import { chainsData } from '@/constants/chains';
import { POOL_ABI } from '@/daao-sdk/abi/pool';
import { handleViemTransactionError } from '@/utils/approval';
import { getPublicClient } from '@/utils/publicClient';
import { toast as reactToast, toast } from 'react-toastify';
import { Abi, Hex } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';

const useHarvest = ({ chainId }: { chainId: number }) => {
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

  const harvest = async ({ poolAddress }: { poolAddress: Hex }) => {
    try {
      await switchChain();
      const harvestResponse = await writeContractAsync({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: 'harvest',
      });
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: harvestResponse,
        confirmations: 1,
      });
      if (receipt?.status !== 'success') {
        toast.error('Transaction failed');
        throw new Error('Transaction failed');
      }
      toast.success('Harvest successful');
    } catch (error) {
      console.log({ error });
      const { errorMsg } = handleViemTransactionError({
        abi: POOL_ABI as Abi,
        error,
      });
      toast.error('Harvest failed' + errorMsg);
    }
  };

  return { harvest };
};

export default useHarvest;
