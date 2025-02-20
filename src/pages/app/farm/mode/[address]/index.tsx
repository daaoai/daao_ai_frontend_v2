"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ModalWrapper } from "@/components/modalWrapper";
import WithdrawFarms from "@/components/WithdrawFarm";
import DepositFarms from "@/components/DepositFarmModal";
import usePoolList from "@/hooks/farm/usePoolList";
import { useParams, useRouter } from "next/navigation";
import { FarmPool } from "@/types/farm";
import useHarvest from "@/hooks/farm/useHarvest";
import { Hex } from "viem";
import useGetBalance from "@/hooks/useGetBalance";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { abbreviateNumber } from "@/utils/numbers";

const FarmStake = () => {
  const params = useParams();
  const router = useRouter();

  const address = params?.address;
  if (!address) {
    return <div>Loading...</div>;
  }

  const { harvest } = useHarvest();
  const { decimals, balance } = useGetBalance();

  console.log(address, "address");

  const { getPoolDetails } = usePoolList();
  const [poolData, setPoolData] = useState<FarmPool>();

  useEffect(() => {
    console.log(address, "address");
    const fetchPoolAddresses = async () => {
      try {
        const response = await getPoolDetails({
          poolAddress: address as `0x${string}`,
        });
        if (response) {
          setPoolData(response);
        }
        console.log("ResponsePoolDetails:", response);
      } catch (error) {
        console.error("Error fetching pool addresses:", error);
      }
    };
    fetchPoolAddresses();
  }, []);

  console.log(poolData, "poolDATA");

  const handleHarvest = () => {
    harvest({ poolAddress: address as Hex });
  };

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const openDepositModal = useCallback(() => setIsDepositModalOpen(true), []);
  const closeDepositModal = useCallback(() => setIsDepositModalOpen(false), []);
  const openWithdrawModal = useCallback(() => setIsWithdrawModalOpen(true), []);
  const closeWithdrawModal = useCallback(
    () => setIsWithdrawModalOpen(false),
    []
  );
  const date = `Active from ${new Date(
    Number(poolData?.startTime.toString()) * 1000
  )
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(" ", "/")} until ${new Date(
    Number(poolData?.endTime.toString()) * 1000
  )
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(" ", "/")}`;

  const now = Date.now();
  const startTime = poolData ? Number(poolData.startTime) * 1000 : 0;
  const endTime = poolData ? Number(poolData.endTime) * 1000 : 0;
  const withdrawDisabled = now >= startTime && now <= endTime;

  const isHarvestDisabled =
    !poolData?.userInfo.rewardDebt ||
    BigInt(0) == poolData?.userInfo.rewardDebt;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2F2F2F]">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          &larr; Back to Farms
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="bg-[#0d0d0d] border-[#383838] border-2 rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {/* <h1 className="text-2xl font-bold">$TBA (lorem)</h1> */}
          </div>

          {/* Subtitle / Info Path */}
          {/* <div className="flex items-center space-x-2 mb-6 text-sm text-gray-400">
            <span className="font-medium text-white">Stake</span>
            <span className="text-gray-600">&rarr;</span>
            <span>Alameda Research v2</span>
            <span className="text-gray-600">&rarr;</span>
            <span>Earn Floppa</span>
          </div> */}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-gray-400">APR</p>
              <p className="text-lg font-semibold text-white">
                {Number(poolData?.apr).toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">TVL</p>
              <p className="text-lg font-semibold text-white">
                {Number(abbreviateNumber(poolData?.totalStackedUSD!))}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Your Stake</p>
              <p className="text-lg font-semibold text-white">0 YT</p>
            </div>
            <div>
              <p className="text-gray-400">Your Reward Balance</p>
              <p className="text-lg font-semibold text-white">0.0000000 DWL</p>
            </div>
            <div>
              <p className="text-gray-400">Rewards Remaining</p>
              <p className="text-lg font-semibold text-white">
                {poolData?.rewards?.remainingRewards}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Rewards Balance</p>
              <p className="text-lg font-semibold text-white">
                {poolData?.rewards?.rewards}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Duration</p>
              <p className="text-lg font-semibold text-white">{date}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              className="flex-1 bg-[#27292a] hover:bg-[#323435] transition text-white py-2 rounded-md font-semibold"
              onClick={openDepositModal}
            >
              Deposit
            </button>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled={withdrawDisabled}
                    className={`flex-1 bg-[#27292a] hover:bg-[#323435] transition text-white py-2 rounded-md font-semibold ${
                      withdrawDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={withdrawDisabled ? undefined : openWithdrawModal}
                  >
                    Withdraw
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-white bg-gray-800 p-2">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {"Currently Not Active"}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <button
              disabled={isHarvestDisabled}
              className={`flex-1 bg-[#27292a] hover:bg-[#323435] transition text-white py-2 rounded-md font-semibold ${
                isHarvestDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isHarvestDisabled ? undefined : handleHarvest}
            >
              Harvest
            </button>
          </div>
          <ModalWrapper
            isOpen={isWithdrawModalOpen}
            onClose={closeWithdrawModal}
          >
            <WithdrawFarms
              onClose={closeWithdrawModal}
              poolAddress={address as Hex}
            />
          </ModalWrapper>
          <ModalWrapper isOpen={isDepositModalOpen} onClose={closeDepositModal}>
            <DepositFarms
              onClose={closeDepositModal}
              poolAddress={address as Hex}
            />
          </ModalWrapper>
        </div>
      </div>
    </div>
  );
};

export default FarmStake;
