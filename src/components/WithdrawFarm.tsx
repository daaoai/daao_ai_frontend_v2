'use client';
import useWithDraw from '@/hooks/farm/useWithdraw';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card';
import { FarmPool } from '@/types/farm';
import { Loader, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatUnits, Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

interface WithdrawProps {
  onClose: () => void;
  poolAddress: Hex;
  poolData: FarmPool;
  chainId: number;
}

const WithdrawFarms: React.FC<WithdrawProps> = ({ onClose, poolAddress, poolData, chainId }) => {
  const { withdraw, startWithdraw, getWithdrawalTime } = useWithDraw({ chainId });
  const { address } = useAccount();

  const [withDrawEnable, setWithdrawEnable] = useState(false);
  const [withdrawAmount] = useState<number>(
    parseFloat(formatUnits(poolData.userInfo.stakedAmount, poolData.depositTokenDetails.decimals)),
  );
  const [withdrawTimeLeft, setWithdrawTimeLeft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [withdrawTxnMessage, setWithdrawTxnMessage] = useState<{
    status: 'success' | 'error' | null;
    msg: string | null;
  }>({
    status: null,
    msg: null,
  });

  const fetchWithdrawalTime = async () => {
    setLoading(true);
    if (address) {
      const timeLeft = await getWithdrawalTime({ address, poolAddress });
      if (timeLeft === 'Available Now') {
        setWithdrawEnable(true);
      } else if (timeLeft === 'Not Initiated') {
        setWithdrawEnable(false);
      } else {
        setWithdrawTimeLeft(timeLeft);
        setWithdrawEnable(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWithdrawalTime();
  }, [address]);

  const handleWithdraw = async () => {
    setLoading(true);
    setWithdrawTxnMessage({
      status: null,
      msg: null,
    });

    if (!withDrawEnable) {
      toast.success('Withdrawal Not Available currently');
      setLoading(false);
      return;
    }

    toast.success('Withdrawal in progress...');

    try {
      await withdraw({
        poolAddress,
        amount: parseUnits(withdrawAmount.toString(), poolData.depositTokenDetails.decimals),
      });

      setTimeout(
        () =>
          setWithdrawTxnMessage({
            status: null,
            msg: null,
          }),
        5000,
      );
    } catch (error) {
      console.log(error, 'error');
      setWithdrawTxnMessage({
        status: 'error',
        msg: 'Withdrawal Failed',
      });
      toast.error('Withdrawal Failed ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawFlow = async () => {
    if (address) {
      if (withdrawTimeLeft && withdrawTimeLeft !== 'Available Now') {
        toast.error('Withdrawal Not Available currently');
        return;
      }

      setLoading(true);
      setWithdrawTxnMessage({
        status: null,
        msg: null,
      });

      try {
        const txn = await startWithdraw({ poolAddress });
        if (txn?.status === 'success') {
          setWithdrawTxnMessage({
            status: 'success',
            msg: 'Withdrawal Initiated Successfully',
          });
          toast.success('Withdrawal Initiated Successfully ✅');

          fetchWithdrawalTime();

          setTimeout(
            () =>
              setWithdrawTxnMessage({
                status: null,
                msg: null,
              }),
            5000,
          );
        }
      } catch (error) {
        console.log(error, 'error');
        setWithdrawTxnMessage({
          status: 'error',
          msg: 'Withdrawal Initiated Failed',
        });
        toast.error('Withdrawal Initiated Failed ❌');
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Card className="w-full max-w-lg bg-gray-40 border border-gray-30 rounded-xl shadow-lg text-white">
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
          <p className="text-white">
            Tokens Staked: {formatUnits(poolData.userInfo.stakedAmount, poolData.depositTokenDetails.decimals)}
            {` ${poolData.depositTokenDetails.symbol}`}
          </p>

          {withdrawTimeLeft && <p className="text-yellow-400">Withdrawal available in: {withdrawTimeLeft}</p>}

          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-white rounded-md bg-black hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={withDrawEnable ? handleWithdraw : handleWithdrawFlow}
            // onClick={handleWithdraw}
            disabled={withdrawAmount === 0 || loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Processing...
              </>
            ) : (
              'Withdraw'
            )}
          </button>

          {withdrawTxnMessage.status === 'success' && (
            <p className="text-green-500 text-center mt-2">{withdrawTxnMessage.msg} ✅</p>
          )}
          {withdrawTxnMessage.status === 'error' && (
            <p className="text-red-500 text-center mt-2">{withdrawTxnMessage.msg} ❌</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawFarms;
