import { chainsData } from '@/config/chains';
import { supportedChainIds } from '@/constants/chains';
import { DAAO_CONTRACT_ABI } from '@/daao-sdk/abi/daao';
import { UserContributionInfo } from '@/types/contribution';
import { DaoInfo } from '@/types/dao';
import { multicallForSameContract } from '@/utils/multicall';
import { getPublicClient } from '@/utils/publicClient';
import { getTokenDetails } from '@/utils/token';
import { getContract, Hex, zeroAddress } from 'viem';

const modeTokenAddress = '0xDfc7C877a950e49D2610114102175A06C2e3167a';

export const fetchDaoInfo = async ({
  chainId,
  daoAddress,
  useWnativeToken = false,
}: {
  chainId: number;
  daoAddress: Hex;
  useWnativeToken?: boolean;
}): Promise<DaoInfo | null> => {
  try {
    const daoFunctions = [
      'fundraisingGoal',
      'totalRaised',
      'goalReached',
      'fundraisingFinalized',
      'fundraisingDeadline',
      'daoToken',
      'PAYMENT_TOKEN',
      'tierLimits',
    ];

    let [fundraisingGoal, totalRaised, goalReached, fundraisingFinalized, fundraisingDeadline, daoToken, paymentToken] =
      (await multicallForSameContract({
        abi: DAAO_CONTRACT_ABI,
        address: daoAddress,
        chainId,
        functionNames: daoFunctions,
        params: daoFunctions.map(() => []),
      })) as [bigint, bigint, boolean, boolean, bigint, Hex, Hex];

    const publicClient = getPublicClient(chainId);

    const contract = getContract({
      address: daoAddress,
      client: publicClient,
      abi: DAAO_CONTRACT_ABI,
    });

    const isModeChain = chainId === supportedChainIds.mode;

    // special case for mode as contract does not have payment token function
    paymentToken = isModeChain ? modeTokenAddress : paymentToken;

    const isPaymentTokenNative = isModeChain ? false : await contract.read.isPaymentTokenNative();

    const [daoTokenDetails, paymentTokenDetails] = await Promise.all([
      daoToken === zeroAddress
        ? useWnativeToken
          ? chainsData[chainId].wnativeToken
          : chainsData[chainId].nativeCurrency
        : getTokenDetails({ address: daoToken, chainId }),
      paymentToken === zeroAddress || isPaymentTokenNative
        ? useWnativeToken
          ? chainsData[chainId].wnativeToken
          : chainsData[chainId].nativeCurrency
        : getTokenDetails({ address: paymentToken, chainId }),
    ]);

    return {
      fundraisingGoal,
      totalRaised,
      goalReached,
      fundraisingFinalized,
      daoToken,
      paymentToken,
      fundraisingDeadline: Number(fundraisingDeadline) * 1000,
      isPaymentTokenNative,
      daoTokenDetails,
      paymentTokenDetails,
    };
  } catch (err) {
    console.log({ err });
    return null;
  }
};

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

export const fetchIsFundraisingFinalized = async ({
  daoAddress,
  chainId,
}: {
  daoAddress: Hex;
  chainId: number;
}): Promise<boolean> => {
  try {
    const publicClient = getPublicClient(chainId);
    const fundraisingFinalized = await publicClient.readContract({
      address: daoAddress,
      abi: DAAO_CONTRACT_ABI,
      functionName: 'fundraisingFinalized',
      args: [],
    });
    return fundraisingFinalized;
  } catch (err) {
    console.log({ err });
    return false;
  }
};
