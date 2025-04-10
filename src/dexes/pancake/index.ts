import { getDexAddressesForChain, supportedDexesTypes } from '@/constants/dex';
import { getPublicClient } from '@/utils/publicClient';
import { Hex, PublicClient } from 'viem';
import { UniswapDex } from '../uniswap';

export class PancakeDex extends UniswapDex {
  constructor(chainId: number) {
    super(chainId, supportedDexesTypes.pancake);
  }
}
