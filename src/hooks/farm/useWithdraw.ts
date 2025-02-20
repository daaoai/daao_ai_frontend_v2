import { usePublicClient, useWriteContract } from "wagmi";
import { POOL_ABI } from "@/abi/pool";
import { useToast } from "../use-toast";
import { handleViemTransactionError } from "@/utils/approval";
import { Abi, Hex } from "viem";
import { workSans } from "@/lib/fonts";
import { FARM_CONTRACT_ADDRESS } from "@/constants/farm";
import { FARM_ABI } from "@/abi/farm";

const useWithDraw = () => {
  const publicClient = usePublicClient();

  // const { checkAllowance, requestAllowance } = useAllowance();
  const { writeContractAsync } = useWriteContract();
  const { toast } = useToast();

  const withdraw = async ({
    poolAddress,
    amount,
  }: {
    poolAddress: `0x${string}`;
    amount: bigint;
  }) => {
    try {
      // let allowanceSufficient = await checkAllowance(amount, poolAddress);
      // if (!allowanceSufficient) {
      //     const approvalTx = await requestAllowance(amount, poolAddress);
      //     allowanceSufficient = true
      // }
      const withdrawResponse = await writeContractAsync({
        address: poolAddress,
        abi: POOL_ABI,
        functionName: "withdraw",
        args: [amount],
      });
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: withdrawResponse,
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

  const startWithdraw = async () => {
    try {
      const startWithdrawResponse = await writeContractAsync({
        address: FARM_CONTRACT_ADDRESS,
        abi: FARM_ABI,
        functionName: "startWithdraw",
      });
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: startWithdrawResponse,
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

  const getWithdrawalTime = async ({ address }: { address: Hex }) => {
    try {
      const startWithdrawResponse = await publicClient?.readContract({
        address: FARM_CONTRACT_ADDRESS,
        abi: FARM_ABI,
        functionName: "withdrawalTime",
        args: [address],
      });
      return String(startWithdrawResponse);
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
      return String(0);
    }
  };

  return { withdraw, startWithdraw, getWithdrawalTime };
};

export default useWithDraw;
