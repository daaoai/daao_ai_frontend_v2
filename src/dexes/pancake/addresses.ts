import { supportedChainIds } from '@/constants/chains';
import { DexAddresses } from '@/types/dex';

export const pancakeAddressesByChainId: Record<number, DexAddresses> = {
  [supportedChainIds.bsc]: {
    factoryAddress: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    swapRouterAddress: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
    quoterAddress: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  },
};
