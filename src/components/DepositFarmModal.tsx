"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import useDeposit from "@/hooks/farm/useDeposit";
import { formatUnits, Hex, parseUnits } from "viem";
import { CARTEL_TOKEN_ADDRESS } from "@/constants/ticket";
import useGetBalance from "@/hooks/useGetBalance";
import { useToast } from "@/hooks/use-toast";
import { workSans } from "@/lib/fonts";
interface DepositFarmsProps {
  onClose: () => void;
  poolAddress: Hex;
}
const DepositFarms: React.FC<DepositFarmsProps> = ({
  onClose,
  poolAddress,
}) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const { deposit } = useDeposit();
  const { toast } = useToast();

  const handleDeposit = async () => {
    const response = await deposit({
      tokenAddress: CARTEL_TOKEN_ADDRESS,
      poolAddress,
      amount: parseUnits(depositAmount.toString(), 18),
    });
    if (response?.status === "success") {
      toast({
        title: "Deposit Successfull",
        variant: "default",
        className: `${workSans.className}`,
      });
    }
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
            className="w-full px-3 py-2 bg-[#27292a] hover:bg-[#323435] text-white rounded-md  transition-all"
            onClick={handleDeposit}
          >
            Deposit
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositFarms;
