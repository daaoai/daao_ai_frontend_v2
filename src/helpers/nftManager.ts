import { supportedDexesTypes } from '@/constants/dex';
import { UniswapNFTManager } from '@/dexes/uniswap/nftManager';
import { VelodromeNFTManager } from '@/dexes/velodrome/nftManager';
import { SupportedDexType } from '@/types/chains';
import { GetUserNFTsForPoolRequest } from '@/types/dex';
import { Hex } from 'viem';

export const getUserNFTsForPool = async (data: GetUserNFTsForPoolRequest) => {
  const handlers = {
    [supportedDexesTypes.uniswapCustomRouter]: async () => {
      const uniswapNftManager = new UniswapNFTManager();
      return await uniswapNftManager.getUserNFTsForPool(data);
    },
    [supportedDexesTypes.velodromeCustomRouter]: async () => {
      const velodromeNftManager = new VelodromeNFTManager();
      return await velodromeNftManager.getUserNFTsForPool(data);
    },
    [supportedDexesTypes.pancake]: async () => {
      const uniswapNftManager = new UniswapNFTManager();
      return await uniswapNftManager.getUserNFTsForPool(data);
    },
    [supportedDexesTypes.kodiak]: async () => {
      const uniswapNftManager = new UniswapNFTManager();
      return await uniswapNftManager.getUserNFTsForPool(data);
    },
  };

  const handler = handlers[data.type];
  if (!handler) {
    throw new Error(`Unsupported dex type: ${data.type}`);
  }
  return await handler();
};

export const getNFTDetails = async ({
  nftManagerAddress,
  nftId,
  chainId,
  type,
}: {
  nftManagerAddress: Hex;
  chainId: number;
  nftId: bigint;
  type: SupportedDexType;
}) => {
  const handlers = {
    [supportedDexesTypes.uniswapCustomRouter]: async () => {
      const uniswapNftManager = new UniswapNFTManager();
      return await uniswapNftManager.getNFTDetails({ chainId, nftId, nftManagerAddress });
    },
    [supportedDexesTypes.velodromeCustomRouter]: async () => {
      const velodromeNftManager = new VelodromeNFTManager();
      return await velodromeNftManager.getNFTDetails({ chainId, nftId, nftManagerAddress });
    },
    [supportedDexesTypes.pancake]: async () => {
      const uniswapNftManager = new UniswapNFTManager();
      return await uniswapNftManager.getNFTDetails({ chainId, nftId, nftManagerAddress });
    },
    [supportedDexesTypes.kodiak]: async () => {
      const uniswapNftManager = new UniswapNFTManager();
      return await uniswapNftManager.getNFTDetails({ chainId, nftId, nftManagerAddress });
    },
  };

  const handler = handlers[type];
  if (!handler) {
    throw new Error(`Unsupported dex type: ${type}`);
  }
  return await handler();
};
