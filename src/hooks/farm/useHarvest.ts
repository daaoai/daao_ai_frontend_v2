import { usePublicClient, useWriteContract } from "wagmi";
import useAllowance from "../useAllowance";
import { POOL_ABI } from "@/abi/pool";
import { useToast } from "../use-toast";
import { handleViemTransactionError } from "@/utils/approval";
import { Abi } from "viem";
import { workSans } from "@/lib/fonts";

const useHarvest = () => {
  const publicClient = usePublicClient();
  const { checkAllowance, requestAllowance } = useAllowance();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  const harvest = async ({ poolAddress }: { poolAddress: `0x${string}` }) => {
    try {
      const harvestResponse = await writeContractAsync({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: "harvest",
      });
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: harvestResponse,
        confirmations: 1,
      });
      return receipt;
    } catch (error) {
      console.log({ error });
      const { errorMsg } = handleViemTransactionError({
        abi: POOL_ABI as Abi,
        error: error,
      });
      toast({
        title: errorMsg,
        variant: "destructive",
        className: `${workSans.className}`,
      });
    }
  };

  return { harvest };
};

export default useHarvest;
