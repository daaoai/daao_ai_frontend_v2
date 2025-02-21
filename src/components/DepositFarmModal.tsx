"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Loader2 } from "lucide-react"; // Import Loader2 icon
import useDeposit from "@/hooks/farm/useDeposit";
import { formatUnits, Hex, parseUnits } from "viem";
import { CARTEL_TOKEN_ADDRESS } from "@/constants/ticket";
import useGetBalance from "@/hooks/useGetBalance";
import { useToast } from "@/hooks/use-toast";
import { workSans } from "@/lib/fonts";

interface DepositFarmsProps {
  onClose: () => void;
  poolAddress: Hex;
  fetchPoolAddresses: () => void;
}

const DepositFarms: React.FC<DepositFarmsProps> = ({
  onClose,
  poolAddress,
  fetchPoolAddresses,
}) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean | null>(null); // ✅ Track success state

  const { deposit } = useDeposit();
  const { toast } = useToast();

  const handleDeposit = async () => {
    setIsLoading(true);
    setDepositSuccess(null);

    const response = await deposit({
      tokenAddress: CARTEL_TOKEN_ADDRESS,
      poolAddress,
      amount: parseUnits(depositAmount.toString(), 18),
    });

    if (response?.status === "success") {
      setDepositSuccess(true);
      toast({
        title: "Deposit Successful",
        variant: "default",
        className: `${workSans.className}`,
      });
      fetchPoolAddresses();
    } else {
      setDepositSuccess(false);
    }

    setIsLoading(false);
    console.log(response);
  };

  const { decimals, balance } = useGetBalance();

  return (
    <Card className="w-full max-w-lg bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl shadow-lg text-white">
      <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-white">
            Deposit
          </CardTitle>
        </div>
        <button
          className="text-gray-400 hover:text-white transition-all"
          onClick={onClose}
          aria-label="Close"
          title="Close"
        >
          <XCircle size={22} />
        </button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold">
            Balance{" "}
            {Number(
              formatUnits((balance ?? 0) as bigint, decimals ?? 18)
            ).toFixed(2)}{" "}
            CARTEL
          </p>
          <input
            type="text"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#1E1E1E] text-white rounded-md border border-[#2D2D2D] focus:outline-none"
          />
          <button
            className="w-full px-3 py-2 bg-[#27292a] hover:bg-[#323435] text-white rounded-md flex items-center justify-center gap-2 transition-all"
            onClick={handleDeposit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Processing...
              </>
            ) : (
              "Deposit"
            )}
          </button>

          {depositSuccess === true && (
            <p className="text-green-500">Deposit Successful ✅</p>
          )}
          {depositSuccess === false && (
            <p className="text-red-500">Deposit Failed ❌</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositFarms;
