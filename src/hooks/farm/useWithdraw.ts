import { usePublicClient, useWriteContract } from "wagmi";
import useAllowance from "../useAllowance";
import { POOL_ABI } from "@/abi/pool";
import { useToast } from "../use-toast";
import { handleViemTransactionError } from "@/utils/approval";
import { Abi } from "viem";
import { workSans } from "@/lib/fonts";

const useWithDraw = () => {
    const publicClient = usePublicClient();

    // const { checkAllowance, requestAllowance } = useAllowance();
    const { writeContractAsync } = useWriteContract();
    const { toast } = useToast();

    const withdraw = async ({poolAddress, amount}: {poolAddress: `0x${string}`, amount: bigint}) => {
        try {
            // let allowanceSufficient = await checkAllowance(amount, poolAddress);
            // if (!allowanceSufficient) {
            //     const approvalTx = await requestAllowance(amount, poolAddress);
            //     allowanceSufficient = true
            // }
            const withdrawResponse =  await writeContractAsync({
                address: poolAddress,
                abi: POOL_ABI,
                functionName: "withdraw",
                args:[amount]
            });
            const receipt = await publicClient?.waitForTransactionReceipt({
                hash: withdrawResponse,
                confirmations: 1,
              });
            return receipt;
        }  catch (error) {
            console.log({ error });
            const { errorMsg} = handleViemTransactionError({ abi: POOL_ABI as Abi,  error: error })
            toast({
                title: errorMsg,
                variant: "destructive",
                className: `${workSans.className}`
              })
        }
    };

    return {withdraw}
}

export default useWithDraw