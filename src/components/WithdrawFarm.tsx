"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import useWithDraw from "@/hooks/farm/useWithdraw";
import { Hex, parseUnits } from "viem";

interface WithdrawProps {
  onClose: () => void;
  poolAddress: Hex;

}

const WithdrawFarms: React.FC<WithdrawProps> = ({ onClose ,poolAddress}) => {
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const { withdraw} = useWithDraw();

  const handleWithdraw = () => {
    withdraw({poolAddress, amount: parseUnits(withdrawAmount.toString(), 18)})
  };

  return (
    <Card className="w-full max-w-lg bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl shadow-lg text-white">
      <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-white">Withdraw</CardTitle>
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
          <input
            type="text"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#1E1E1E] text-white rounded-md border border-[#2D2D2D] focus:outline-none"
          />
          <button
            className="w-full px-3 py-2 text-white rounded-md bg-[#27292a] hover:bg-[#323435]transition-all"
            onClick={handleWithdraw}
          >
            Withdraw
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawFarms;
