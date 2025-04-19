import { getDexAddressesForChain, supportedDexesTypes } from '@/constants/dex';
import { SupportedDexType } from '@/types/chains';
import { DexProtocol, PoolAddressRequest, QuotesRequest, SwapDataRequest } from '@/types/dex';
import { getPublicClient } from '@/utils/publicClient';
import { encodeFunctionData, Hex, PublicClient } from 'viem';
import { UniswapCustomRouterDex } from '../UniswapCustomRouter';
import { KODIAK_QUOTER_ABI } from './abi/quoter';
import { KODIAK_ROUTER_ABI } from './abi/router';

export class KodiakDex implements DexProtocol {
  factoryAddress: Hex;
  swapRouterAddress: Hex;
  quoterAddress: Hex;
  publicClient: PublicClient;
  chainId: number;
  private customDex: UniswapCustomRouterDex;

  constructor(chainId: number, type: SupportedDexType = supportedDexesTypes.kodiak) {
    const dexDetails = getDexAddressesForChain(chainId, type);
    this.customDex = new UniswapCustomRouterDex(chainId, type);
    this.chainId = chainId;
    this.factoryAddress = dexDetails.factoryAddress;
    this.swapRouterAddress = dexDetails.swapRouterAddress;
    this.quoterAddress = dexDetails.quoterAddress;
    this.publicClient = getPublicClient(chainId);
  }

  getPoolAddress = async ({ token0, token1, fee, tickSpacing }: PoolAddressRequest) => {
    return this.customDex.getPoolAddress({ token0, token1, fee, tickSpacing });
  };

  getPoolDetails = async (address: Hex) => {
    return this.customDex.getPoolDetails(address);
  };

  fetchQuotes = async ({ tokenIn, tokenOut, fee, amount, sqrtPrice }: QuotesRequest) => {
    return (
      await this.publicClient.simulateContract({
        address: this.quoterAddress,
        abi: KODIAK_QUOTER_ABI,
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

  generateSwapData = ({ tokenIn, tokenOut, fee, recipient, amount, minAmount, sqrtPrice }: SwapDataRequest) => {
    const callData = encodeFunctionData({
      abi: KODIAK_ROUTER_ABI,
      args: [
        {
          amountIn: amount,
          fee,
          amountOutMinimum: minAmount,
          recipient,
          sqrtPriceLimitX96: sqrtPrice,
          tokenIn,
          tokenOut,
        },
      ],
      functionName: 'exactInputSingle',
    });

    return {
      callData,
      to: this.swapRouterAddress,
      value: 0n,
    };
  };
}
