import { AddLiquidityParams } from '@/types/addLiquidity';
import { encodeFunctionData } from 'viem';
import { uniswapV3NFTManagerAbi } from './abi/nftManager';

export class UniswapNFTManager {
  generateMintCallData = ({
    token0,
    token1,
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    recipient,
    deadline,
    fee,
  }: AddLiquidityParams) => {
    return encodeFunctionData({
      abi: uniswapV3NFTManagerAbi,
      functionName: 'mint',
      args: [
        {
          amount0Desired,
          amount0Min,
          amount1Desired,
          amount1Min,
          deadline,
          recipient,
          fee,
          tickLower,
          tickUpper,
          token0,
          token1,
        },
      ],
    });
  };
}
