import { chainsData, supportedChainIds } from '@/constants/chains';
import { DAAO_CONTRACT_ABI } from '@/daao-sdk/abi/daao';
import { BasicDaoInfo, DaoInfo, DaoMarketData } from '@/types/daao';
import { multicallForSameContract } from '@/utils/multicall';
import { getTokenDetails } from '@/utils/token';
import { Hex, zeroAddress } from 'viem';

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
      'owner',
      'isPaymentTokenNative',
    ];

    let [
      fundraisingGoal,
      totalRaised,
      goalReached,
      fundraisingFinalized,
      fundraisingDeadline,
      daoToken,
      paymentToken,
      owner,
      isPaymentTokenNative,
    ] = (await multicallForSameContract({
      abi: DAAO_CONTRACT_ABI,
      address: daoAddress,
      chainId,
      functionNames: daoFunctions,
      params: daoFunctions.map(() => []),
    })) as [bigint, bigint, boolean, boolean, bigint, Hex, Hex, Hex, boolean];

    const isModeChain = chainId === supportedChainIds.mode;

    // special case for mode as contract does not have payment token function
    paymentToken = isModeChain ? modeTokenAddress : paymentToken;

    const [daoTokenDetails, paymentTokenDetails] = await Promise.all([
      daoToken === zeroAddress
        ? useWnativeToken
          ? getTokenDetails({ address: chainsData[chainId].wnativeToken.address, chainId })
          : getTokenDetails({ address: chainsData[chainId].nativeCurrency.address, chainId })
        : getTokenDetails({ address: daoToken, chainId }),
      paymentToken === zeroAddress || isPaymentTokenNative
        ? useWnativeToken
          ? getTokenDetails({ address: chainsData[chainId].wnativeToken.address, chainId })
          : getTokenDetails({ address: chainsData[chainId].nativeCurrency.address, chainId })
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
      owner,
    };
  } catch (err) {
    console.log({ err });
    return null;
  }
};

export const fetchDaaoBasicInfo = async ({
  daoAddress,
  chainId,
}: {
  daoAddress: Hex;
  chainId: number;
}): Promise<BasicDaoInfo> => {
  try {
    const functions = ['fundraisingFinalized', 'daoToken', 'PAYMENT_TOKEN'];

    const isModeChain = chainId === supportedChainIds.mode;

    const [fundraisingFinalized, daaoToken, paymentToken] = (await multicallForSameContract({
      abi: DAAO_CONTRACT_ABI,
      address: daoAddress,
      chainId,
      functionNames: functions,
      params: functions.map(() => []),
    })) as [boolean, Hex, Hex];

    return {
      fundraisingFinalized,
      daaoToken,
      paymentToken: isModeChain ? modeTokenAddress : paymentToken,
    };
  } catch (err) {
    console.log({ err });
    return {
      fundraisingFinalized: false,
      daaoToken: zeroAddress,
      paymentToken: zeroAddress,
    };
  }
};

export const fetchDaoMarketData = async ({
  chainId,
  daaoToken,
}: {
  chainId: number;
  daaoToken: Hex;
}): Promise<DaoMarketData | null> => {
  if (chainsData[chainId]?.networkType === 'testnet') {
    return {
      price: Math.random() * 100,
      marketCap: Math.random() * 1000000,
      liquidity: Math.random() * 100000,
      volume: Math.random() * 10000,
    };
  }
  if (!chainsData[chainId]?.dexScreenerId) return null;
  const url = `https://api.dexscreener.com/token-pairs/v1/${chainsData[chainId].dexScreenerId}/${daaoToken}`;
  try {
    const response = await fetch(url);
    const dexScreenerData = await response.json();
    if (dexScreenerData && Array.isArray(dexScreenerData) && dexScreenerData[0]) {
      const price = dexScreenerData[0].priceUsd;
      const marketCap = Number(dexScreenerData[0].marketCap).toFixed(0);
      const liq = Number(dexScreenerData[0].liquidity?.usd).toFixed(2);
      const volume = Number(dexScreenerData[0].volume?.h24).toFixed(2);
      return {
        price: Number(price),
        marketCap: Number(marketCap),
        liquidity: Number(liq),
        volume: Number(volume),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
};
