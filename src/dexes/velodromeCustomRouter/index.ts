import { supportedDexesTypes } from '@/constants/dex';
import { VELO_FACTORY_ABI } from '@/daao-sdk/abi/veloFactory';
import { Hex } from 'viem';
import { UniswapCustomRouterDex } from '../UniswapCustomRouter';

export class VelodromeCustomRouterDex extends UniswapCustomRouterDex {
  constructor(chainId: number) {
    super(chainId, supportedDexesTypes.velodromeCustomRouter);
  }

  getPoolAddress = async ({ token0, token1, tickSpacing }: { token0: Hex; token1: Hex; tickSpacing: number }) => {
    return await this.publicClient.readContract({
      abi: VELO_FACTORY_ABI,
      functionName: 'getPool',
      args: [token0, token1, tickSpacing],
      address: this.factoryAddress,
    });
  };
}
