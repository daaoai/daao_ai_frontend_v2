import { chainsData } from '@/constants/chains';
import { tokensByChainId } from '@/data/tokens';
import { getTokensBalance } from '@/helpers/token';
import { Asset } from '@/types/dashboard';
import { TokenBalance } from '@/types/token';
import { useState } from 'react';
import { formatUnits, Hex } from 'viem';
import { useAccount } from 'wagmi';
import useTokenPrice from './useTokenPrice';

export const useTokenBalance = ({ chainId }: { chainId: number }) => {
  const { address: account } = useAccount();
  const { fetchTokenPriceGecko } = useTokenPrice();
  const [tokensWithBalance, setTokensWithBalance] = useState<Asset[]>([]);
  const [isTokensBalanceLoading, setIsTokenBalanceLoading] = useState(false);

  const fetchLocalTokenBalances = async () => {
    try {
      if (!account) return;

      setIsTokenBalanceLoading(true);
      const tokens = tokensByChainId[chainId];
      const tokenAddress = Object.keys(tokens);
      const [balancesRes, pricesRes] = await Promise.allSettled([
        getTokensBalance(tokenAddress as Hex[], chainId, account),
        Promise.allSettled(tokenAddress.map((address) => fetchTokenPriceGecko({ address, chainId }))),
      ]);

      const balances = (balancesRes.status === 'fulfilled' ? balancesRes.value : {}) as Record<string, bigint>;
      const prices =
        pricesRes.status === 'fulfilled'
          ? pricesRes.value.map((res) => (res.status === 'fulfilled' ? res.value : 0))
          : [];

      const tokenDetailsWithBalances = tokenAddress
        .map((address, index) => {
          const token = tokens[address];
          const price = prices[index] || 0;
          const balance = balances[address] || BigInt(0);
          return {
            price: prices[index] || 0,
            tokenIcon: token.logo,
            totalValue: Number(formatUnits(balance, token.decimals)) * price,
            token: token.symbol,
            balance: Number(formatUnits(balance, token.decimals)),
          };
        })
        .filter((token) => token.balance > 0)
        .sort((a, b) => b.totalValue - a.totalValue);

      setTokensWithBalance(tokenDetailsWithBalances);
    } catch (e) {
      console.error('Error fetching token balances:', e);
    } finally {
      setIsTokenBalanceLoading(false);
    }
  };

  const fetchTokenBalances = async () => {
    fetchLocalTokenBalances();
  };

  return {
    tokensWithBalance,
    isTokensBalanceLoading,
    fetchTokenBalances,
  };
};
