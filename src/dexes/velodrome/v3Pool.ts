import { Hex } from 'viem';
import { UniswapV3Pool } from '../uniswap/v3Pool';
import { velodromeV3PoolAbi } from './abi/v3Pool';

export class VelodromeV3Pool extends UniswapV3Pool {
  constructor(chainId: number, address: Hex) {
    super(chainId, address, velodromeV3PoolAbi);
  }
}
