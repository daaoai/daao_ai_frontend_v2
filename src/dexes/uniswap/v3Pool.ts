import { getPublicClient } from '@/utils/publicClient';
import { Abi, Hex, PublicClient } from 'viem';
import { uniswapV3PoolAbi } from './abi/v3Pool';

export class UniswapV3Pool {
  address: Hex;
  chainId: number;
  publicClient: PublicClient;
  abi: Abi;

  constructor(chainId: number, address: Hex, abi: Abi = uniswapV3PoolAbi) {
    this.abi = abi;
    this.chainId = chainId;
    this.address = address;
    this.publicClient = getPublicClient(chainId);
  }

  slot0 = async () => {
    const slot0 = (await this.publicClient.readContract({
      abi: this.abi,
      functionName: 'slot0',
      args: [],
      address: this.address,
    })) as [bigint, number];
    return {
      sqrtPriceX96: slot0[0],
      currentTick: slot0[1],
    };
  };
}
