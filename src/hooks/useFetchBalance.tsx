import { chainsData } from '@/config/chains';
import { TIER_LABELS } from '@/constants/contribution';
import { UserContributionInfo } from '@/types/contribution';
import * as lodash from 'lodash';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

export const useFetchBalance = () => {
  const { address: account, chainId } = useAccount();

  const [data, setData] = useState({
    balance: '0',
    tierNumber: 0,
    isWhitelisted: false,
    maxLimit: BigInt(0),
    contributedAmountYet: BigInt(0),
    daoToken: '',
    goalReached: false,
    finalisedFundraising: false,
    endDate: '',
    fundraisingGoal: '',
    totalRaised: '',
    userTierLabel: 'None',
  });

  const refetch = async () => {
    try {
      if (chainId) {
        const chainData = chainsData[chainId];
        const daoAddress = chainData.daoAddress;
        const tokenDetails = chainData.contribution.token;

        let userContributionInfo: UserContributionInfo | undefined;
        let balance = BigInt(0);
        let tierLimit = BigInt(0);

        setData((prev) => ({
          ...prev,
          balance: formatUnits(balance, tokenDetails.decimals),
          tierNumber: userContributionInfo?.whitelistInfo.tier || 0,
          isWhitelisted: userContributionInfo?.whitelistInfo.isWhitelisted || false,
          contributedAmountYet: userContributionInfo?.contributions || BigInt(0),
          userTierLabel: userContributionInfo?.whitelistInfo.tier
            ? TIER_LABELS[userContributionInfo?.whitelistInfo.tier] || 'None'
            : 'None',
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const throttledRefreshData = lodash.throttle(() => refreshData(), 1000);

  useEffect(() => {
    if (account && chainId) {
      throttledRefreshData();
    }
  }, [account, chainId]);

  const refreshData = async () => {
    console.log('🔄 Refetching contract data...');
    await refetch();
  };
  return { data, refreshData };
};
