import { supportedChainIds } from '@/constants/chains';
import { DexAddresses } from '@/types/dex';

export const pancakeAddressesByChainId: Record<number, DexAddresses> = {
  [supportedChainIds.bsc]: {
    factoryAddress: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    swapRouterAddress: '0x88E564D3cFf40d99C76e43434Ce293B6f545F024',
    quoterAddress: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  },
};
