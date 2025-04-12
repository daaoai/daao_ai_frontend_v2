import { supportedDexesTypes } from '@/constants/dex';
import { KodiakDex } from '../kodiakDex';
import { PANCAKE_ROUTER_ABI } from './abi/router';
import { PANCAKE_QUOTER_ABI } from './abi/quoter';
import { QuotesRequest, SwapDataRequest } from '@/types/dex';
import { encodeFunctionData } from 'viem';

export class PancakeDex extends KodiakDex {
  constructor(chainId: number) {
    super(chainId, supportedDexesTypes.pancake);
  }

  fetchQuotes = async ({ tokenIn, tokenOut, fee, amount, sqrtPrice }: QuotesRequest) => {
    return (
      await this.publicClient.simulateContract({
        address: this.quoterAddress,
        abi: PANCAKE_QUOTER_ABI,
        functionName: 'quoteExactInputSingle',
        args: [
          {
            amountIn: amount,
            fee,
            sqrtPriceLimitX96: sqrtPrice,
            tokenIn,
            tokenOut,
          },
        ],
      })
    ).result[0];
  };

  generateSwapData = ({ poolAddress, zeroToOne, amount, sqrtPrice, minAmount, deadline }: SwapDataRequest) => {
    const args = [poolAddress, zeroToOne, amount, sqrtPrice, minAmount, deadline] as const;

    const callData = encodeFunctionData({
      abi: PANCAKE_ROUTER_ABI,
      args,
      functionName: 'getSwapResult',
    });

    return {
      callData,
      to: this.swapRouterAddress,
      value: 0n,
    };
  };
}
