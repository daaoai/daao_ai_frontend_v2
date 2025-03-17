import { createPublicClient, http, PublicClient, Chain, Transport, HttpTransport } from 'viem';
import { ChainConfig } from '../types/chain';
import { DexFactory } from '../factories/DexFactory';
import { IDex } from '../types/IDex';
import { SimulateService } from './SimulateService';
import { SimulateCallParams } from '../types/simulate';

export class ChainService {
  private client: PublicClient<HttpTransport, Chain>;
  private dex: IDex;
  private simulateService: SimulateService;

  constructor(
    private chainConfig: ChainConfig,
    private chain: Chain,
  ) {
    this.client = createPublicClient({
      chain: this.chain,
      transport: http(chainConfig.rpcUrl),
      batch: {
        multicall: true,
      },
    }) as PublicClient<HttpTransport, Chain>;

    this.dex = DexFactory.createDex(chainConfig.dexInfo, chain);
    this.simulateService = new SimulateService(this.client);
  }

  getDex(): IDex {
    return this.dex;
  }

  getClient(): PublicClient<HttpTransport, Chain> {
    return this.client;
  }

  getChainConfig(): ChainConfig {
    return this.chainConfig;
  }

  simulate(params: SimulateCallParams) {
    return this.simulateService.simulateContract(params);
  }

  simulateBatch(params: SimulateCallParams[]) {
    return this.simulateService.simulateContractBatch(params);
  }
}
