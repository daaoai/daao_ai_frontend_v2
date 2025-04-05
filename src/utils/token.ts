import { tokensByChainId } from '@/tokens';
import { Token, SupportedChain } from '@/types/chains';
import { erc20Abi, Hex } from 'viem';
import { multicallForSameContract } from './multicall';

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
