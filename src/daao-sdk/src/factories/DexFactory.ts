import { Chain } from 'viem';
import { IDex } from '../types/IDex';
import { VelodromeDex } from '../dex/VelodromeDex';
// import { UniswapDex } from '../dex/UniswapDex';
import { DexInfo } from '../types/chain';

export class DexFactory {
  static createDex(dexInfo: DexInfo, chain: Chain): IDex {
    switch (dexInfo.type) {
      case 'Velodrome':
        return new VelodromeDex(dexInfo, chain);
      //   case 'Uniswap':
      //     return new UniswapDex(dexInfo, chain);
      default:
        throw new Error(`Unsupported DEX type: ${dexInfo.type}`);
    }
  }
}
