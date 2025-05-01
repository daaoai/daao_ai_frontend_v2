import { SupportedDexType } from '@/types/chains';
import { Hex } from 'viem';
import { supportedChainIds } from './chains';
import { supportedDexesTypes } from './dex';

export const farmFactoryAddressesByChainId: {
  [chainId: number]: {
    factory: Hex;
  };
} = {
  [supportedChainIds.mode]: {
    factory: '0x06B79282BA0b442F398443007246CEC43d1833A6',
  },
  [supportedChainIds.bsc]: {
    factory: '0xA2E34eAe3fae892716FF59dc3c9B638a3b762ed9',
  },
  [supportedChainIds.bera]: {
    factory: '0x90d83b3b3844A2A56Dd4a29A42CBc12a4673b4Ea',
  },
};

export const lpFarmAddressesByChainId: {
  [chainId: number]: {
    dexType: SupportedDexType;
    lpFarm: Hex;
    rewardToken: Hex;
    poolAddress: Hex;
    refundee: Hex;
    startTime: bigint;
    endTime: bigint;
  };
} = {
  [supportedChainIds.mode]: {
    dexType: supportedDexesTypes.uniswapCustomRouter,
    lpFarm: '0xd9cC1D4565102AE6118476EF0E531e7956487099',
    poolAddress: '0xF70e76cC5a39Aad1953BeF3D1647C8B36f3f6324',
    refundee: '0x6F1313f206dB52139EB6892Bfd88aC9Ae36Dc54E',
    rewardToken: '0x98E0AD23382184338dDcEC0E13685358EF845f30',
    startTime: BigInt(1742572185),
    endTime: BigInt(1745164185),
  },
  [supportedChainIds.bsc]: {
    dexType: supportedDexesTypes.pancake,
    lpFarm: '0xC4Cc6784d32a3732fB991D0E5bA5553757B54E1a',
    poolAddress: '0x306777b6dD5FB09e944B1E2818F15F74D3E42b81',
    refundee: '0x6F1313f206dB52139EB6892Bfd88aC9Ae36Dc54E',
    rewardToken: '0x55d398326f99059fF775485246999027B3197955',
    startTime: BigInt(1746096093),
    endTime: BigInt(1748688093),
  },
};
