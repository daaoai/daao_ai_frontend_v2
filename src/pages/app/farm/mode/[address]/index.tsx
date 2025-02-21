"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ModalWrapper } from "@/components/modalWrapper";
import WithdrawFarms from "@/components/WithdrawFarm";
import DepositFarms from "@/components/DepositFarmModal";
import usePoolList from "@/hooks/farm/usePoolList";
import { useParams, useRouter } from "next/navigation";
import { FarmPool } from "@/types/farm";
import useHarvest from "@/hooks/farm/useHarvest";
import { formatUnits, Hex } from "viem";
import useGetBalance from "@/hooks/useGetBalance";
import { abbreviateNumber } from "@/utils/numbers";
import { useAccount } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";

const FarmStake = () => {
  const params = useParams();
  const router = useRouter();
  const address = params?.address;

  const { harvest } = useHarvest();
  const { getPoolDetails } = usePoolList();

  const [isPoolDetailsLoading, setIsPoolDetailsLoading] = useState(true);
  const [poolData, setPoolData] = useState<FarmPool>();

  useEffect(() => {
    if (!address) return;
    fetchPoolAddresses();
  }, [address]);

  const fetchPoolAddresses = async () => {
    try {
      setIsPoolDetailsLoading(true);
      const response = await getPoolDetails({
        poolAddress: address as `0x${string}`,
      });

      if (response) {
        setPoolData(response);
      }
    } catch (error) {
      console.error("Error fetching pool addresses:", error);
    } finally {
      setIsPoolDetailsLoading(false);
    }
  };

  const handleHarvest = async () => {
    if (poolData?.unclaimedReward && poolData.unclaimedReward > BigInt(0)) {
      harvest({ poolAddress: address as Hex });
    }
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

  const date = poolData
    ? `Active from ${new Date(Number(poolData?.startTime) * 1000)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .replace(" ", "/")} until ${new Date(Number(poolData?.endTime) * 1000)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .replace(" ", "/")}`
    : "";

  const isHarvestDisabled = poolData?.unclaimedReward == BigInt(0);
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
          {/* Pool Address - Shows Loading if Undefined */}
          <div className="text-gray-400 mb-6 flex items-center">
            Pool Address:
            {address ? (
              <span className="text-white truncate w-80 inline-block overflow-hidden whitespace-nowrap">
                {address}
              </span>
            ) : (
              <Skeleton className="w-40 h-5 inline-block" />
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-gray-400">APR</p>
              {isPoolDetailsLoading ? (
                <Skeleton className="w-20 h-6" />
              ) : (
                <p className="text-lg font-semibold text-white">
                  {Number(poolData?.apr).toFixed(4)}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-400">TVL</p>
              {isPoolDetailsLoading ? (
                <Skeleton className="w-20 h-6" />
              ) : (
                <p className="text-lg font-semibold text-white">
                  $ {Number(abbreviateNumber(poolData?.totalStackedUSD!))}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-400">Pending Rewards</p>
              {isPoolDetailsLoading ? (
                <Skeleton className="w-20 h-6" />
              ) : (
                <p className="text-lg font-semibold text-white">
                  {poolData?.unclaimedReward
                    ? abbreviateNumber(
                        Number(
                          Number(
                            formatUnits(poolData?.unclaimedReward, 18)
                          ).toFixed(2)
                        )
                      )
                    : "0"}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-400">Stacked CARTEL</p>
              {isPoolDetailsLoading ? (
                <Skeleton className="w-20 h-6" />
              ) : (
                <p className="text-lg font-semibold text-white">
                  {poolData?.userInfo?.stackedAmount
                    ? formatUnits(poolData?.userInfo?.stackedAmount, 18)
                    : "0"}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <p className="text-gray-400">Duration</p>
              {isPoolDetailsLoading ? (
                <Skeleton className="w-48 h-6" />
              ) : (
                <p className="text-lg font-semibold text-white">{date}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex space-x-2">
            <button
              className={`flex-1 bg-[#27292a] transition text-white py-2 rounded-md font-semibold ${
                isPoolDetailsLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={openDepositModal}
              disabled={isPoolDetailsLoading}
            >
              Deposit
            </button>

            <button
              className={`flex-1 bg-[#27292a] transition text-white py-2 rounded-md font-semibold ${
                isPoolDetailsLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#323435]"
              }`}
              onClick={openWithdrawModal}
              disabled={isPoolDetailsLoading}
            >
              Withdraw
            </button>

            <button
              disabled={isHarvestDisabled}
              className={`flex-1 bg-[#27292a] transition text-white py-2 rounded-md font-semibold ${
                isHarvestDisabled || isPoolDetailsLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#323435]"
              }`}
              onClick={handleHarvest}
            >
              Harvest
            </button>
          </div>

          {/* Modals */}
          <ModalWrapper
            isOpen={isWithdrawModalOpen}
            onClose={closeWithdrawModal}
          >
            {poolData && (
              <WithdrawFarms
                onClose={closeWithdrawModal}
                poolAddress={address as Hex}
                poolData={poolData}
              />
            )}
          </ModalWrapper>
          <ModalWrapper isOpen={isDepositModalOpen} onClose={closeDepositModal}>
            <DepositFarms
              onClose={closeDepositModal}
              poolAddress={address as Hex}
              fetchPoolAddresses={fetchPoolAddresses}
            />
          </ModalWrapper>
        </div>
      </div>
    </div>
  );
};

export default FarmStake;
