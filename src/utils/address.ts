import { chainsData } from '@/constants/chains';
import { getAddress, isAddress } from 'viem';

export function shortenAddress(address: string) {
  console.log('Address is ', address);
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export const isNativeToken = (address: string, chainId: number): boolean => {
  const checkSumAddress = isAddress(address) ? getAddress(address) : address;
  const chainInfo = chainsData[chainId];
  return chainInfo.nativeCurrency.address === checkSumAddress;
};
