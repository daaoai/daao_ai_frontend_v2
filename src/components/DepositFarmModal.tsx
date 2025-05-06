'use client';
import { getTokensBalance } from '@/helpers/token';
import useDeposit from '@/hooks/farm/useDeposit';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { FarmPool } from '@/types/farm';
import { Loader2, XCircle } from 'lucide-react'; // Import Loader2 icon
import React, { useEffect, useState } from 'react';
import { formatUnits, Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

interface DepositFarmsProps {
  onClose: () => void;
  poolAddress: Hex;
  poolData: FarmPool;
  refreshFarmData: () => void;
  chainId: number;
}

const DepositFarms: React.FC<DepositFarmsProps> = ({ onClose, poolData, refreshFarmData, chainId }) => {
  const [depositTokenBalance, setDepositTokenBalance] = useState<bigint>(0n);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean | null>(null); // ✅ Track success state
  const depositTokenDetails = poolData.depositTokenDetails;

  const { address: account } = useAccount();
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;
      const balance = await getTokensBalance([depositTokenDetails.address], chainId, account);
      setDepositTokenBalance(balance[depositTokenDetails.address]);
    };
    fetchBalance();
  }, [account]);

  const { deposit } = useDeposit({ chainId });
  const { toast } = useToast();

  const handleDeposit = async () => {
    setIsLoading(true);
    setDepositSuccess(null);

    const response = await deposit({
      tokenAddress: poolData.depositTokenDetails.address,
      poolAddress: poolData.poolAddress,
      amount: parseUnits(depositAmount.toString(), poolData.depositTokenDetails.decimals),
    });

    if (response?.status === 'success') {
      setDepositSuccess(true);
      toast({
        title: 'Deposit Successful',
        variant: 'default',
      });
      refreshFarmData();
    } else {
      setDepositSuccess(false);
    }

    setIsLoading(false);
    console.log(response);
  };

  return (
    <Card className="w-full max-w-lg bg-gray-40 border border-gray-30 rounded-xl shadow-lg text-white">
      <CardHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-white">Deposit</CardTitle>
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
            Balance {Number(formatUnits(depositTokenBalance as bigint, depositTokenDetails.decimals)).toFixed(2)}{' '}
            {depositTokenDetails.symbol}
          </p>
          <input
            type="number"
            placeholder="Enter amount"
            onChange={(e) => {
              setDepositAmount(Number(e.target.value) || 0);
              setDepositSuccess(null);
            }}
            className="w-full px-3 py-2 bg-black text-white rounded-md border border-[#2D2D2D] focus:outline-none"
          />
          <button
            className="w-full px-3 py-2 bg-black hover:bg-[#323435] text-white rounded-md flex items-center justify-center gap-2 transition-all"
            onClick={handleDeposit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Processing...
              </>
            ) : (
              'Deposit'
            )}
          </button>

          {depositSuccess === true && <p className="text-green-500">Deposit Successful ✅</p>}
          {depositSuccess === false && <p className="text-red-500">Deposit Failed ❌</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositFarms;
