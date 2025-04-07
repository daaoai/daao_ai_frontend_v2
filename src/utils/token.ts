import { chainsData } from '@/config/chains';
import { tokensByChainId } from '@/tokens';
import { SupportedChain, Token } from '@/types/chains';
import { erc20Abi, Hex } from 'viem';
import { multicallForSameContract } from './multicall';
import { getPublicClient } from './publicClient';

const fetchErc20Info = async ({ address, chainId }: { address: Hex; chainId: number }) => {
  const multicallRes = (await multicallForSameContract({
    abi: erc20Abi,
    address,
    chainId,
    functionNames: ['symbol', 'decimals', 'name'],
    params: [[], [], []],
  })) as [
    string, // symbol
    number, // decimals
    string, // name
  ];
  return {
    symbol: multicallRes[0],
    decimals: multicallRes[1],
    name: multicallRes[2] || multicallRes[0],
    address,
  };
};

export const getTokenDetails = async ({
  address,
  chainId,
}: {
  address: Hex;
  chainId: SupportedChain;
}): Promise<Token> => {
  const tokenDetails = tokensByChainId[chainId]?.[address];
  if (!tokenDetails) {
    return await fetchErc20Info({ address, chainId });
  }
  return tokenDetails;
};
export const isNativeCurrency = (address: string, chainId: number): boolean => {
  const chainInfo = chainsData[chainId];
  return chainInfo?.nativeCurrency.address === address;
};

export const fetchTokenBalance = async ({ token, account, chainId }: { token: Hex; account: Hex; chainId: number }) => {
  try {
    const publicClient = getPublicClient(chainId);
    const balance = isNativeCurrency(token, chainId)
      ? await publicClient.getBalance({ address: account })
      : await publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account],
        });
    return balance;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return BigInt(0);
  }
};
