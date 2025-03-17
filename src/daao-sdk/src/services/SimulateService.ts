import { Address, PublicClient } from 'viem';
import { SimulateCallParams, SimulateResult } from '../types/simulate';

export class SimulateService {
  constructor(private publicClient: PublicClient) {}

  /**
   * Simulate a contract write operation
   */
  async simulateContract<T = unknown>(params: SimulateCallParams): Promise<SimulateResult<T>> {
    try {
      const result = await this.publicClient.simulateContract({
        ...params,
        account: params.account as Address,
      });

      return {
        success: true,
        result: result.result as T,
      };
    } catch (error) {
      console.error('Simulation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Simulate multiple contract calls in a batch
   */
  async simulateContractBatch(params: SimulateCallParams[]) {
    try {
      const results = await Promise.all(params.map((param) => this.simulateContract(param)));

      return {
        success: true,
        results,
      };
    } catch (error) {
      console.error('Batch simulation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
