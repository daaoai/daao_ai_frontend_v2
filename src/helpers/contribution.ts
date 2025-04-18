import { DAAO_CONTRACT_ABI } from '@/daao-sdk/abi/daao';
import { UserContributionInfo } from '@/types/contribution';
import { multicallForSameContract } from '@/utils/multicall';
import { getPublicClient } from '@/utils/publicClient';
import { Hex } from 'viem';

export const fetchUserContributionInfo = async ({
  account,
  daoAddress,
  chainId,
  tokenDecimals,
}: {
  account: Hex | undefined;
  daoAddress: Hex;
  chainId: number;
  tokenDecimals: number;
}): Promise<UserContributionInfo> => {
  let whitelistInfo: readonly [boolean, number, bigint] | undefined;
  let contributions: bigint | undefined;
  if (account) {
    [contributions, whitelistInfo] = (await multicallForSameContract({
      abi: DAAO_CONTRACT_ABI,
      address: daoAddress,
      chainId,
      functionNames: ['contributions', 'getWhitelistInfo'],
      params: [[account], [account]],
    })) as [bigint, [boolean, number, bigint]];
  }

  return {
    whitelistInfo: {
      isWhitelisted: whitelistInfo?.[0] ?? false,
      tier: whitelistInfo?.[1] ?? 0,
      limit: whitelistInfo?.[2] ?? BigInt(0),
    },
    contributions: contributions ?? BigInt(0),
  };
};

export const fetchTierLimits = async ({
  tier,
  chainId,
  daoAddress,
}: {
  tier: number;
  chainId: number;
  daoAddress: Hex;
}) => {
  try {
    const publicClient = getPublicClient(chainId);
    const tierLimits = await publicClient.readContract({
      address: daoAddress,
      abi: DAAO_CONTRACT_ABI,
      functionName: 'tierLimits',
      args: [tier],
    });
    return tierLimits;
  } catch (err) {
    console.log({ err });
    return BigInt(0);
  }
};
