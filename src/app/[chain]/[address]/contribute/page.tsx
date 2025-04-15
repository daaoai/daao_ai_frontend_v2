'use client';
import AnimatedSkeleton from '@/components/animatedSkeleton';
import { PageLayout } from '@/components/page-layout';
import { chainIdToChainSlugMap, chainSlugToChainIdMap, defaultChain } from '@/constants/chains';
import { fundsByChainId } from '@/data/funds';
import useContribution from '@/hooks/farm/useContribution';
import useEffectAfterMount from '@/hooks/useEffectAfterMount';
import useTokenPrice from '@/hooks/token/useTokenPrice';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Token } from '@/types/chains';
import { UserContributionInfo } from '@/types/contribution';
import { DaoInfo } from '@/types/daao';
import { isChainIdSupported } from '@/utils/chains';
import { fetchTokenBalance, getTokenDetails } from '@/utils/token';
import Decimal from 'decimal.js';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast as reactToast } from 'react-toastify';
import { formatUnits, Hex, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

const TIER_TYPE: { [key: string]: string } = {
  '0': 'User not whitelisted, not allowed to contribute',
  '1': 'Platinum Tier',
  '2': 'Gold Tier',
  '3': 'Silver Tier',
};

export default function Page() {
  // hooks
  const { address: accountAddress, chainId: accountChainId } = useAccount();
  const { fetchTokenPriceDexScreener } = useTokenPrice();
  const { chain, address } = useParams();
  const router = useRouter();

  // states
  const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));
  const [contributionTokenDetails, setContributionTokenDetails] = useState<Token | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [tokenPrice, setTokenPrice] = useState<number>(0);

  // Local loading state for contributing only
  const [isContributing, setIsContributing] = useState<boolean>(false);

  // DAO & user info
  const [daoInfoData, setDaoInfoData] = useState<DaoInfo | null>(null);
  const [userContributionInfo, setUserContributionInfo] = useState<UserContributionInfo | null>(null);
  const [tierLimits, setTierLimits] = useState<bigint>(BigInt(0));

  // constants
  const account = accountAddress as Hex;
  const chainId = chainSlugToChainIdMap[chain as string];
  const fundAddress = address as Hex;
  const fundDetails = fundsByChainId[chainId][fundAddress];

  // Hooks from useContribution
  const {
    getDaoInfo,
    loading: hookLoading,
    contribute,
    getTierLimits,
    getUserContributionInfo,
    contributeWithToken,
  } = useContribution({
    chainId,
    fundDetails,
  });

  const currentContributions = userContributionInfo?.contributions || BigInt(0);

  const totalRaisedPercentage = daoInfoData
    ? new Decimal(daoInfoData.totalRaised.toString())
        .dividedBy(daoInfoData.fundraisingGoal.toString())
        .times(100)
        .toNumber()
    : 0;

  const totalRaisedFormatted = formatUnits(
    daoInfoData?.totalRaised || BigInt(0),
    contributionTokenDetails?.decimals || 18,
  );
  const fundraisingGoalFormatted = formatUnits(
    daoInfoData?.fundraisingGoal || BigInt(0),
    contributionTokenDetails?.decimals || 18,
  );

  const contributionsFormatted = formatUnits(
    userContributionInfo?.contributions || BigInt(0),
    contributionTokenDetails?.decimals || 18,
  );
  const tierLimitsFormatted = formatUnits(tierLimits, contributionTokenDetails?.decimals || 18);

  // Contribute function
  async function handleContribute() {
    if (!contributionTokenDetails) return;
    if (!account) {
      reactToast.error('Please connect your wallet');
      return;
    }

    const formattedAmount = new Decimal(inputValue);
    if (!formattedAmount || isNaN(formattedAmount.toNumber()) || formattedAmount.toNumber() <= 0) {
      reactToast.error('Please enter a valid amount');
      return;
    }

    const amountInUnits = parseUnits(
      formattedAmount.toFixed(contributionTokenDetails.decimals),
      contributionTokenDetails.decimals,
    );

    if (amountInUnits + currentContributions > tierLimits) {
      reactToast.error(`Contribution exceeds your tier limit of ${tierLimits}`);
      return;
    }

    if (userBalance < amountInUnits) {
      reactToast.error(
        `Insufficient balance. You have ${userBalance.toString()} ${contributionTokenDetails.name} available`,
      );
      return;
    }

    setIsContributing(true);
    try {
      if (daoInfoData?.isPaymentTokenNative) {
        await contribute(amountInUnits);
      } else {
        await contributeWithToken(amountInUnits);
      }
      setInputValue('');
    } catch (error) {
      console.error('Contribution error:', error);
    } finally {
      setIsContributing(false);
      updateUserInfo();
      updateDaoInfo();
    }
  }

  const updateUserBalance = async () => {
    if (!account || !contributionTokenDetails) return;
    const balance = await fetchTokenBalance({
      account,
      chainId,
      token: contributionTokenDetails.address,
    });
    setUserBalance(balance);
  };

  const updateContributionTokenDetetails = async () => {
    try {
      const tokenDetails = await getTokenDetails({
        address: fundDetails.token,
        chainId,
      });
      if (tokenDetails) {
        setContributionTokenDetails(tokenDetails);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const updateTokenPrice = async () => {
    try {
      if (!contributionTokenDetails) return;
      const price = await fetchTokenPriceDexScreener(contributionTokenDetails.address);
      setTokenPrice(Number(price));
    } catch (err) {
      console.log({ err });
    }
  };

  const updateUserTierLimit = async (tier: number) => {
    try {
      const tierLimitsValue = await getTierLimits(tier);
      setTierLimits(tierLimitsValue);
    } catch (err) {
      console.log({ err });
    }
  };

  const updateDaoInfo = async () => {
    try {
      const daoInfo = await getDaoInfo();
      if (daoInfo) {
        setDaoInfoData(daoInfo);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const updateUserInfo = async () => {
    try {
      const userInfo = await getUserContributionInfo();
      if (userInfo) {
        setUserContributionInfo(userInfo);
        updateUserTierLimit(userInfo.whitelistInfo.tier);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    if (account) {
      updateUserInfo();
      updateUserBalance();
    }
  }, [account]);

  useEffect(() => {
    updateDaoInfo();
    updateContributionTokenDetetails();
  }, []);

  useEffect(() => {
    updateTokenPrice();
    updateUserBalance();
  }, [contributionTokenDetails]);

  useEffect(() => {
    if (daoInfoData?.fundraisingFinalized) {
      router.replace(`/${chain}/${address}/swap`);
    }
  }, [daoInfoData]);

  useEffectAfterMount(() => {
    if (!accountChainId) return;
    if (accountChainId === chainId) return;
    if (isChainIdSupported(accountChainId)) {
      const chainSlug = chainIdToChainSlugMap[accountChainId];
      router.replace(`/${chainSlug}`);
    } else {
      router.replace(`/${defaultChain.slug}`);
    }
  }, [accountChainId]);

  return (
    <PageLayout title="contribution" description="contribution">
      <div className="flex items-center justify-center p-4 bg-[#101010] border-gray-800 border rounded-xl mt-12">
        <div className="w-full max-w-3xl text-white">
          {/* ---------- TOP CARD / IMAGE / DAO INFO SECTION ---------- */}
          <div className="flex gap-6 mb-8">
            <div className="relative w-32 h-32 overflow-hidden rounded-lg">
              <Image src={fundDetails.imgSrc} alt={fundDetails.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              {/* Title is static */}
              <h1 className="text-2xl font-bold mb-2 text-left">Sorceror</h1>
              <p className="text-gray-400 text-base leading-relaxed text-left">{fundDetails.description}</p>
              <div className="mt-8 flex justify-between">
                <div className="flex flex-col items-start mb-1 justify-start">
                  <p className="text-[#C4F82A] font-medium">Total Raised</p>
                  {daoInfoData ? (
                    <p className="text-sm font-bold">
                      {totalRaisedFormatted} {daoInfoData.paymentTokenDetails.symbol} ($
                      {Number(totalRaisedFormatted).toFixed(2)})
                    </p>
                  ) : (
                    <AnimatedSkeleton className="w-32 h-4" />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ---------- FUNDING PROGRESS SECTION ---------- */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl">
              <div className="mb-4">
                {daoInfoData ? (
                  <div className="w-full h-6 bg-[#1A1A1A] rounded-md overflow-hidden">
                    <div className="h-full bg-[#8B5CF6]" style={{ width: `${totalRaisedPercentage.toFixed(2)}%` }} />
                  </div>
                ) : (
                  <AnimatedSkeleton className="w-full h-6" />
                )}
                <div className="text-right mt-2 text-sm">
                  {daoInfoData ? (
                    totalRaisedPercentage.toFixed(2) + '%'
                  ) : (
                    <AnimatedSkeleton className="w-16 h-4 inline-block" />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">Fundraising Deadline</span>
                  <span>
                    {daoInfoData ? (
                      new Date(Number(daoInfoData.fundraisingDeadline)).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    ) : (
                      <AnimatedSkeleton className="w-24 h-4 inline-block" />
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Funding Goal</span>
                  <span>
                    {daoInfoData ? (
                      <>
                        {daoInfoData.paymentTokenDetails.symbol} {fundraisingGoalFormatted} ($
                        {(Number(fundraisingGoalFormatted) * tokenPrice).toFixed(2)})
                      </>
                    ) : (
                      <AnimatedSkeleton className="w-32 h-4 inline-block" />
                    )}
                  </span>
                </div>
              </div>
              {/* ---------- TIER / WHITELIST / CONTRIBUTION CARD ---------- */}
              {!account ? (
                <div className="bg-yellow-800 text-yellow-200 p-4 rounded-lg mb-4">
                  Please connect your wallet to contribute
                </div>
              ) : !userContributionInfo ? (
                <div className="bg-gray-800 text-gray-200 p-4 rounded-lg mb-4">
                  <AnimatedSkeleton className="w-full h-4" />
                </div>
              ) : !userContributionInfo.whitelistInfo.isWhitelisted ? (
                <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-4">
                  Your address is not whitelisted for this contribution
                </div>
              ) : (
                <div className="bg-black rounded-lg p-4 mb-8 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold">
                      {userContributionInfo ? (
                        TIER_TYPE[userContributionInfo.whitelistInfo.tier.toString()]
                      ) : (
                        <AnimatedSkeleton className="w-24 h-4 inline-block" />
                      )}
                    </h3>
                    <div className="w-6 h-6 rounded-full">
                      {userContributionInfo && userContributionInfo.whitelistInfo.tier !== undefined ? (
                        <img
                          src={
                            userContributionInfo.whitelistInfo.tier === 2
                              ? '/assets/gold-medal.svg'
                              : userContributionInfo.whitelistInfo.tier === 3
                                ? '/assets/silver-medal.svg'
                                : userContributionInfo.whitelistInfo.tier === 1
                                  ? '/assets/bronze-medal.svg'
                                  : undefined
                          }
                          alt="Tier Icon"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <AnimatedSkeleton className="w-6 h-6 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <p className="text-gray-400 mb-1">Max</p>
                      {userContributionInfo ? (
                        <p className="text-xl">{tierLimitsFormatted}</p>
                      ) : (
                        <AnimatedSkeleton className="w-16 h-6 inline-block" />
                      )}
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-400">Committed</p>
                      {userContributionInfo ? (
                        <p className="text-xl">{contributionsFormatted || 0}</p>
                      ) : (
                        <AnimatedSkeleton className="w-16 h-6 inline-block" />
                      )}
                    </div>
                  </div>
                </div>
              )}
              {daoInfoData?.goalReached ? (
                <p>Funding goal is reached, waiting for finalization...</p>
              ) : (
                <div className="flex w-full">
                  <Input
                    type="text"
                    placeholder="Enter the Amount"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="rounded-r-none text-black bg-white flex-1 h-10 text-lg"
                    disabled={!account || !userContributionInfo?.whitelistInfo.isWhitelisted || isContributing}
                  />
                  <Button
                    onClick={handleContribute}
                    className="rounded-l-none bg-[#C4F82A] text-black hover:bg-[#D5FF3A] h-10 px-8 text-lg font-medium"
                    disabled={!account || !userContributionInfo?.whitelistInfo.isWhitelisted || isContributing}
                  >
                    {isContributing ? 'Processing...' : 'Contribute'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
