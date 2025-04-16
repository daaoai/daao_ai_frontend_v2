import { supportedChainIds } from '@/constants/chains';
import { DexAddresses } from '@/types/dex';

export const customDexAddressesByChainId: Record<number, DexAddresses> = {
  [supportedChainIds.monad]: {
    factoryAddress: '0x961235a9020B05C44DF1026D956D1F4D78014276',
    swapRouterAddress: '0xa4c3eDA0E6C4Ad82Fa8962129010cC57d6e5198A',
    quoterAddress: '0xA53B2F4e131AE2eBb01a72a45F88d9417bAf9aA7',
    nftManager: '0x3dCc735C74F10FE2B9db2BB55C40fbBbf24490f7',
  },
};
