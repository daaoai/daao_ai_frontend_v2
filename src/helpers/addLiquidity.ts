import { supportedDexesTypes } from '@/constants/dex';
import { UniswapNFTManager } from '@/dexes/uniswap/nftManager';
import { VelodromeNFTManager } from '@/dexes/velodrome/nftManager';
import { AddLiquidityParams } from '@/types/addLiquidity';
import { SupportedDexType } from '@/types/chains';
import { Hex } from 'viem';

export const generateAddLiquidityCallData = ({ data, type }: { data: AddLiquidityParams; type: SupportedDexType }) => {
  const uniswapHandler = () => {
    const uniswapPool = new UniswapNFTManager();
    return uniswapPool.generateMintCallData(data);
  };
  const velodromeHandler = () => {
    const velodromeDex = new VelodromeNFTManager();
    return velodromeDex.generateMintCallData(data);
  };
  const handlers: {
    [key in SupportedDexType]: () => Hex;
  } = {
    [supportedDexesTypes.uniswapCustomRouter]: uniswapHandler,
    [supportedDexesTypes.velodromeCustomRouter]: velodromeHandler,
    [supportedDexesTypes.kodiak]: uniswapHandler,
    [supportedDexesTypes.pancake]: uniswapHandler,
  };
  const handler = handlers[type];

  if (!handler) {
    return '0x';
  }

  return handler();
};
