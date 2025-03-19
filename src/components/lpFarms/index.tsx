'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shadcn/components/ui/card';
import ClickToCopy from '../copyToClipboard';
import { shortenAddress } from '@/utils/address';
import usePoolList from '@/hooks/farm/usePoolList';
import { FarmPool, Position } from '@/types/farm';
import useHarvest from '@/hooks/farm/useHarvest';
import useLpFarms from '@/hooks/farm/uselpFarms';
import { modeTokenAddress } from '@/constants/addresses';
import { CARTEL_TOKEN_ADDRESS } from '@/constants/ticket';
import Image from 'next/image';

interface LPFarm {
  id: number;
  tokenId: number;
  value: string;
  canStake: boolean;
  apr?: string;
}

interface LPFarmsProps {
  onClose: () => void;
  daoTokenAddress: string;
}

const CONTRACT_ADDRESS = '0x7303dbc086a18459A4dc74e74f2Dcc2a2a26131B';

const LPFarms: React.FC<LPFarmsProps> = ({ onClose, daoTokenAddress }) => {
  const [viewMode, setViewMode] = useState<'unstaked' | 'staked'>('unstaked');
  const [poolDetails, setPoolDetails] = useState<FarmPool | null>(null);
  const [isStakeLoading, setIsStakeLoading] = useState(false);
  // const [isUnStakeLoading, setIsUnStakeLoading] = useState(false);
  // const [isUnStakeLoading, setIsUnStakeLoading] = useState(false);

  // const [lpFarmsData, setLpFarmsData] = useState<LPFarm[]>([
  //   { id: 1, tokenId: 6783, value: '$7890', canStake: true, apr: '12%' },
  //   { id: 2, tokenId: 6790, value: '$4560', canStake: false, apr: '15%' },
  //   { id: 3, tokenId: 6790, value: '$4560', canStake: false, apr: '15%' },
  //   { id: 4, tokenId: 6790, value: '$4560', canStake: false, apr: '15%' },
  //   { id: 5, tokenId: 6790, value: '$4560', canStake: false, apr: '15%' },
  //   { id: 6, tokenId: 6790, value: '$4560', canStake: false, apr: '15%' },
  // ]);

  const [userPositions, setUserPositions] = useState<Position[]>([]);

  const { harvest } = useHarvest();
  const { getPositionList, rewardInfo, unStakeFarm, stakeFarm } = useLpFarms();
  const { getPoolDetails } = usePoolList();

  const fetchPoolDetails = async () => {
    try {
      const data = await getPoolDetails({ poolAddress: CONTRACT_ADDRESS });
      setPoolDetails(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPositionList = async () => {
    try {
      const data = await getPositionList();
      console.log('fetchPositionListdata', { data });
      setUserPositions(data);
    } catch (error) {
      console.log('fetchPositionList - error');
      console.error(error);
    }
  };

  console.log(userPositions, 'userPositions');

  useEffect(() => {
    fetchPoolDetails();
    fetchPositionList();
    // rewardInfo();
  }, []);

  // For claim
  const handleHarvest = async () => {
    if (poolDetails?.unclaimedReward && poolDetails.unclaimedReward > BigInt(0)) {
      harvest({ poolAddress: CONTRACT_ADDRESS });
    }
  };

  const toggleView = () => {
    setViewMode(viewMode === 'unstaked' ? 'staked' : 'unstaked');
  };

  const handleStakeFarm = async (id) => {
    try {
      // setLoad(true)
      await stakeFarm(BigInt(position.id));
    } catch (err) {
      console.log({ err });
    }
  };

  const handleUnStakeFarm = (id) => {
    stakeFarm(BigInt(position.id));
  };

  console.log({ poolDetails });

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
              <Image
                src="/assets/defai-cartel-image.svg"
                alt="defai-cartel"
                width={30}
                height={40}
                className="rounded-full object-cover"
              />
              <h2 className="text-xl font-medium text-green-400">DeFAI Cartel</h2>
              <span className="bg-[#D0F0BF] text-black text-xs px-2 py-0.5 rounded ml-auto">Active</span>
            </div>
            <div className="bg-[#053738] p-1 rounded-lg flex gap-x-2 px-3 w-fit mt-6">
              <p className="text-sm sm:text-base">{shortenAddress(CONTRACT_ADDRESS)}</p>
              <ClickToCopy copyText={CONTRACT_ADDRESS} className="text-teal-20" />
            </div>
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
                {/* <span className="mr-2">🪙</span> */}
                <span className="text-[#F8DE7F]">{poolDetails?.unclaimedReward} DAAO</span>
              </div>
              <button className="bg-white text-black text-xs font-medium px-3 py-1 rounded">CLAIM</button>
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
                    {viewMode === 'unstaked' ? 'Can Stake?' : 'APR'}
                  </th>
                  <th className="px-4 py-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="bg-black text-white">
                {userPositions.map((position, index) => (
                  <tr key={position.id}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{position.id}</td>
                    <td className="px-4 py-3">{position.liquidityUsd}</td>
                    <td className="px-4 py-3">
                      {viewMode === 'unstaked'
                        ? position.token0 === modeTokenAddress || position.token1 === CARTEL_TOKEN_ADDRESS
                          ? 'Yes'
                          : 'No'
                        : position.apr}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {viewMode === 'unstaked' ? (
                        <button
                          className="text-black bg-[#D1FF53] text-xs px-3 py-1 rounded"
                          onClick={() => stakeFarm(BigInt(position.id))}
                        >
                          Stake
                        </button>
                      ) : (
                        <button
                          className="text-black bg-[#FFAAAB] text-xs px-3 py-1 rounded"
                          onClick={() => unStakeFarm(BigInt(position.id))}
                        >
                          Unstake
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
