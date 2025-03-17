import { ChainConfig, SupportedChains } from './types/chain';
import { ChainService } from './services/ChainService';
import { mode, Chain } from 'viem/chains';

export class DaaoSdk {
  private chainServices: Map<number, ChainService> = new Map();
  private chainMap: Map<number, Chain> = new Map([[mode.id, mode]]);

  constructor(private supportedChains: SupportedChains) {
    Object.entries(this.supportedChains).forEach(([chainId, chain]) => {
      const viemChain = this.chainMap.get(Number(chainId));
      if (!viemChain) {
        throw new Error(`Chain ${chainId} not supported in viem`);
      }
      this.chainServices.set(Number(chainId), new ChainService(chain, viemChain));
    });
  }

  getChainService(chainId: number): ChainService {
    const service = this.chainServices.get(chainId);
    if (!service) {
      throw new Error(`Chain ${chainId} not supported`);
    }
    return service;
  }

  getSupportedChains(): ChainConfig[] {
    return Array.from(this.chainServices.values()).map((service) => service.getChainConfig());
  }
}
