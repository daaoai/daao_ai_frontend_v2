import { supportedChainIds } from '@/constants/chains';
import { DexAddresses } from '@/types/dex';

export const velodromeCustomDexAddressesByChainId: Record<number, DexAddresses> = {
  [supportedChainIds.mode]: {
    factoryAddress: '0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F',
    swapRouterAddress: '0xC3a15f812901205Fc4406Cd0dC08Fe266bF45a1E',
    quoterAddress: '0xB11f2310D1b3FF589af56b981c17BC57dee1D488',
    nftManager: '0x991d5546C4B442B4c5fdc4c8B8b8d131DEB24702',
  },
};
