"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import useWithDraw from "@/hooks/farm/useWithdraw";
import { formatUnits, Hex, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { FarmPool } from "@/types/farm";

interface WithdrawProps {
  onClose: () => void;
  poolAddress: Hex;
  poolData: FarmPool;
}

const WithdrawFarms: React.FC<WithdrawProps> = ({
  onClose,
  poolAddress,
  poolData,
}) => {
  const { withdraw, startWithdraw, getWithdrawalTime } = useWithDraw();
  const [withDrawEnable, setWithdrawEnable] = useState(false);
  const { address } = useAccount();

  const [withdrawAmount, setWithdrawAmount] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleWithdraw = async () => {
    withdraw({
      poolAddress,
      amount: parseUnits(withdrawAmount.toString(), 18),
    });
  };

  const handleWithdrawFlow = async () => {
    if (address) {
      const withdrawTime = await getWithdrawalTime({ address });
      if (BigInt(withdrawTime) > BigInt(0)) {
        withdraw({
          poolAddress,
          amount: parseUnits(withdrawAmount.toString(), 18),
        });
      } else {
        const txn = await startWithdraw();
        if (txn?.status === "success") {
          setWithdrawEnable(true);
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*\.?\d*$/.test(value)) return;
    const numericValue = value === "" ? "" : parseFloat(value);
    const stakedAmount = parseFloat(
      formatUnits(poolData.userInfo.stackedAmount, 18)
    );
    if (numericValue !== "" && numericValue > stakedAmount) {
      setError(`Amount exceeds your staked tokens (${stakedAmount})`);
    } else {
      setError(null);
    }
    setWithdrawAmount(numericValue);
  };

  return (
    <Card className="w-full max-w-lg bg-[#0D0D0D] border border-[#1E1E1E] rounded-xl shadow-lg text-white">
      <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-white">
            Withdraw
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
          <p className="text-white">
            Tokens Staked : {formatUnits(poolData.userInfo.stackedAmount, 18)}
          </p>
          <input
            type="text"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-[#1E1E1E] text-white rounded-md border border-[#2D2D2D] focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            className="w-full px-3 py-2 text-white rounded-md bg-[#27292a] hover:bg-[#323435] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={withDrawEnable ? handleWithdraw : handleWithdrawFlow}
            disabled={
              withdrawAmount === "" || withdrawAmount === 0 || error !== null
            }
          >
            Withdraw
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawFarms;
