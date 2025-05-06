'use client';
import { lpFarmAddressesByChainId } from '@/constants/farm';
import useLpFarms from '@/hooks/farm/uselpFarms';
import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import { Position } from '@/types/farm';
import { shortenAddress } from '@/utils/address';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import AnimatedSkeleton from '../animatedSkeleton';
import ClickToCopy from '../copyToClipboard';
import FallbackTokenLogo from '/public/assets/fallbackToken.png';
import { Badge } from '@/shadcn/components/ui/badge';

interface LPFarmsProps {
  onClose: () => void;
  chainId: number;
  lpFarmAddress: string;
}

const LPFarms: React.FC<LPFarmsProps> = ({ onClose, chainId, lpFarmAddress }) => {
  const [viewMode, setViewMode] = useState<'unstaked' | 'staked'>('unstaked');
  const [isStakeLoading, setIsStakeLoading] = useState(false);
  const [isUnStakeLoading, setIsUnStakeLoading] = useState(false);
  const [userPositions, setUserPositions] = useState<Position[]>([]);
  const [stakedPositions, setStakedPositions] = useState<Position[]>([]);
  const [unClaimedReward, setUnclaimedRewards] = useState(BigInt(0));
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);
  const [isWithdrawingPosition, setIsWithdrawingPosition] = useState(false);

  const {
    rewardTokenDetails,
    getUserPositionsForPool,
    unStakeFarm,
    stakeFarm,
    getStakedPositionList,
    getClaimableRewards,
    claimRewards,
    withdrawPosition,
    poolDetails,
  } = useLpFarms({ chainId, lpFarmAddress });

  const { name, startTime, endTime } = lpFarmAddressesByChainId[chainId][lpFarmAddress];

  const startTimeMs = Number(startTime.toString()) * 1000;
  const endTimeMs = Number(endTime.toString()) * 1000;
  const now = Date.now();
  const isActive = now >= startTimeMs && now <= endTimeMs;

  const fetchPositionList = async () => {
    try {
      const data = await getUserPositionsForPool();
      setUserPositions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStakedPositionList = async () => {
    try {
      const data = await getStakedPositionList();
      setStakedPositions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClaimableRewards = async () => {
    try {
      const data = await getClaimableRewards();
      setUnclaimedRewards(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClaimableRewards();
  }, []);

  useEffect(() => {
    if (viewMode === 'staked') {
      fetchStakedPositionList();
    } else {
      fetchPositionList();
    }
  }, [viewMode]);

  // const handleHarvest = async () => {
  //   if (poolDetails?.unclaimedReward && poolDetails.unclaimedReward > BigInt(0)) {
  //     harvest({ poolAddress: CONTRACT_ADDRESS });
  //   }
  // };

  const handleStakeFarm = async (id: number) => {
    try {
      setIsStakeLoading(true);
      await stakeFarm(BigInt(id));
      setIsStakeLoading(false);
      await fetchPositionList();
    } catch (err) {
      console.log({ err });
      setIsStakeLoading(false);
    }
  };

  const handleUnStakeFarm = async (id: number) => {
    try {
      setIsUnStakeLoading(true);
      await unStakeFarm(BigInt(id));
      await fetchClaimableRewards();
      await fetchStakedPositionList();
      setIsUnStakeLoading(false);
    } catch (err) {
      console.log({ err });
      setIsUnStakeLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      setIsClaimingRewards(true);
      await claimRewards(unClaimedReward);
      await fetchClaimableRewards();
      setIsClaimingRewards(false);
    } catch (err) {
      console.log({ err });
      setIsClaimingRewards(false);
    }
  };

  const handleWithdrawPosition = async (id: number) => {
    try {
      setIsWithdrawingPosition(true);
      await withdrawPosition(BigInt(id));
      await fetchStakedPositionList();
      setIsWithdrawingPosition(false);
    } catch (err) {
      console.log({ err });
      setIsWithdrawingPosition(false);
    }
  };

  return (
    <div className="w-full">
      <Card className=" text-white border-gray-800 bg-[#101010]">
        <div className="flex items-center justify-between px-4 pt-6">
          <button className="text-teal-50 flex items-center gap-2" onClick={onClose}>
            <div className="bg-black border border-[#302F2F] p-1 rounded-md">
              <ChevronLeft size={15} />
            </div>
            <span className="text-teal-50">Back</span>
          </button>
        </div>
        <CardHeader className="p-4 border-gray-800">
          <div className="bg-black p-4 rounded-md border-[#302F2F] border-b">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-[35px] flex-shrink-0">
                <Image
                  src={poolDetails?.token0Details.logo || FallbackTokenLogo}
                  alt={poolDetails?.token0Details.symbol || ''}
                  width={16}
                  height={16}
                  className="absolute left-0 top-0 w-[35px] h-[35px] rounded-full"
                />
                <Image
                  src={poolDetails?.token1Details.logo || FallbackTokenLogo}
                  alt={poolDetails?.token1Details.symbol || ''}
                  width={16}
                  height={16}
                  className="absolute left-[30px] top-0 w-[35px] h-[35px] rounded-full object-cover"
                />
              </div>
              <h2 className="text-xl font-medium text-[#DFFE01]">{name}</h2>
              <Badge
                variant="secondary"
                className={`flex items-center gap-2 px-3 py-1 rounded-md font-rubik font-regular ml-auto ${
                  isActive ? 'bg-teal-20 text-black' : 'bg-red-400 text-black'
                }`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="bg-[#053738] p-1 rounded-lg flex gap-x-2 px-3 w-fit mt-6">
              <p className="text-sm sm:text-base">{shortenAddress(lpFarmAddress)}</p>
              <ClickToCopy copyText={lpFarmAddress} className="text-teal-20" />
            </div>
            {/* <div className="flex items-center gap-2">
              <p>APR</p> <p className="text-white">{0}</p>
            </div> */}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              className={`py-4 px-4 rounded ${viewMode === 'unstaked' ? 'text-white border border-[#D0F0BF] bg-[#053738]' : 'bg-black text-gray-400 border border-gray-700'}`}
              onClick={() => setViewMode('unstaked')}
            >
              Owned Positions
              <div className="text-xs text-gray-400">LP Owned by your wallet</div>
            </button>
            <button
              className={`py-4 px-4 rounded ${viewMode === 'staked' ? 'bg-[#053738] text-white border border-[#D0F0BF]' : 'bg-black text-gray-400 border border-gray-700'}`}
              onClick={() => setViewMode('staked')}
            >
              <p className="text-[#F8DE7F]"> Staked Positions</p>
              <p className="text-xs text-[#AEB3B6]">NFT Staked in staking contract</p>
            </button>
          </div>
          <div className="bg-black rounded-md p-4 mb-4 border-b border-gray-800 my-6">
            <div className="text-gray-400 mb-2 text-left">Total Claimable Rewards</div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image
                  src={rewardTokenDetails?.logo || FallbackTokenLogo}
                  alt={rewardTokenDetails?.symbol || ''}
                  width={16}
                  height={16}
                  className=" rounded-full h-8 object-cover w-8 mr-4"
                />
                <span className="text-[#F8DE7F]">
                  {formatUnits(unClaimedReward, rewardTokenDetails?.decimals || 18)} {rewardTokenDetails?.symbol}
                  {/* {poolDetails?.unclaimedReward} */}
                </span>
              </div>
              <button
                className="bg-white text-black text-xs font-medium px-3 py-1 rounded disabled:opacity-50"
                onClick={handleClaimRewards}
                disabled={isClaimingRewards || unClaimedReward === BigInt(0)}
              >
                {isClaimingRewards ? 'Claiming...' : 'CLAIM'}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md h-32 max-h-32 overflow-y-scroll">
            <table className="w-full rounded-md text-sm">
              <thead className="bg-[#222222] rounded-md">
                <tr>
                  <th className="text-left px-4 py-2 text-gray-400">No</th>
                  <th className="text-left px-4 py-2 text-gray-400">Token ID</th>
                  <th className="text-left px-4 py-2 text-gray-400">Value</th>
                  <th className="text-left px-4 py-2 text-gray-400">
                    {viewMode === 'unstaked' ? 'Can Stake?' : 'Rewards'}
                  </th>
                  <th className="px-4 py-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="bg-black text-white">
                {isStakeLoading || isUnStakeLoading ? (
                  <tr>
                    <td className="text-center py-4" colSpan={5}>
                      <AnimatedSkeleton className="w-14 h-6 rounded-md" />
                    </td>
                  </tr>
                ) : (viewMode === 'unstaked' ? userPositions : stakedPositions).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      No results found
                    </td>
                  </tr>
                ) : (
                  (viewMode === 'unstaked' ? userPositions : stakedPositions).map((position, index) => (
                    <tr key={position.id}>
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{position.id}</td>
                      <td className="px-4 py-3">{position.liquidityUsd}</td>
                      <td className="px-4 py-3">
                        {viewMode === 'unstaked'
                          ? isActive
                            ? 'Yes'
                            : 'No'
                          : formatUnits(position.rewardInfo, rewardTokenDetails?.decimals || 18)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {viewMode === 'unstaked' ? (
                          <button
                            className="text-black bg-[#D1FF53] text-xs px-3 py-1 rounded disabled:opacity-50"
                            onClick={() => handleStakeFarm(position.id)}
                            disabled={!isActive || isStakeLoading}
                          >
                            Stake
                          </button>
                        ) : (
                          <>
                            {position.numberOfStakes > 0 && (
                              <button
                                className="text-black bg-[#FFAAAB] text-xs px-3 py-1 rounded"
                                onClick={() => handleUnStakeFarm(position.id)}
                              >
                                Unstake
                              </button>
                            )}
                            {position.numberOfStakes === 0 && (
                              <button
                                className="text-black bg-[#FFAAAB] text-xs px-3 py-1 rounded"
                                onClick={() => handleWithdrawPosition(position.id)}
                                disabled={isWithdrawingPosition}
                              >
                                {isWithdrawingPosition ? 'Withdrawing...' : 'Withdraw'}
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-gray-400 text-sm">
            <ul className="list-disc pl-5 text-left">
              <li className="text-[#D0F0BF]">Staking your LP tokens will convert them to NFTs</li>
              <li className="text-[#D0F0BF]">Rewards accrue in real-time and can be claimed at any time.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default LPFarms;
