import { createPublicClient, http, Address, PublicClient, Chain, Transport, HttpTransport } from 'viem';
import { IDex, SwapParams, LiquidityParams } from '../types/IDex';
import { DexInfo } from '../types/chain';
import { VELO_POOL_ABI } from '../abi/veloPool';

export class VelodromeDex implements IDex {
  private client: PublicClient<HttpTransport, Chain>;

  constructor(
    private dexInfo: DexInfo,
    private chain: Chain,
  ) {
    this.client = createPublicClient({
      chain: this.chain,
      transport: http(),
      batch: {
        multicall: true,
      },
    }) as PublicClient<HttpTransport, Chain>;
  }

  async getQuote(params: Omit<SwapParams, 'slippage'>): Promise<bigint> {
    const quoter = await this.client.readContract({
      address: this.dexInfo.quoterAddress,
      abi: VELO_POOL_ABI,
      functionName: 'quoteExactInputSingle',
      args: [params.tokenIn, params.tokenOut, params.amountIn],
    });

    return quoter as bigint;
  }

  async swap(params: SwapParams): Promise<`0x${string}`> {
    return '0x' as `0x${string}`;
  }

  async addLiquidity(params: LiquidityParams): Promise<`0x${string}`> {
    return '0x' as `0x${string}`;
  }

  async removeLiquidity(positionId: string): Promise<`0x${string}`> {
    return '0x' as `0x${string}`;
  }

  async getPairAddress(token0: Address, token1: Address): Promise<Address> {
    const pairAddress = await this.client.readContract({
      address: this.dexInfo.factoryAddress,
      abi: VELO_POOL_ABI,
      functionName: 'getPair',
      args: [token0, token1],
    });

    return pairAddress as Address;
  }
}
