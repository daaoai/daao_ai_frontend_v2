import { supportedChainIds } from '@/constants/chains';
import { ChainsConfig } from '@/types/chains';
import { parseUnits, zeroAddress } from 'viem';

export const chainsData: {
  [key: number]: ChainsConfig;
} = {
  [supportedChainIds.monad]: {
    id: supportedChainIds.monad,
    name: 'Monad Testnet',
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    blockExplorer: 'https://modescan.io',
    contribution: {
      token: {
        address: zeroAddress,
        decimals: 18,
        symbol: 'MON',
        name: 'Monad',
      },
      minAmount: BigInt(0),
      maxAmount: parseUnits('0.1', 18),
    },
    wnativeToken: {
      address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
      decimals: 18,
      symbol: 'WMON',
      name: 'Wrapped Monad',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'Testnet MON Token',
      symbol: 'MON',
      decimals: 18,
    },
    daoAddress: '0x61d4B36dC50Fd637f162f2cd1667e6F0FC2Fb9Da',
    dexInfo: {
      type: 'uniswap',
      factoryAddress: '0x961235a9020B05C44DF1026D956D1F4D78014276',
      swapRouterAddress: '0xa4c3eDA0E6C4Ad82Fa8962129010cC57d6e5198A',
      quoterAddress: '0xA53B2F4e131AE2eBb01a72a45F88d9417bAf9aA7',
    },
  },
  [supportedChainIds.bsc]: {
    id: supportedChainIds.bsc,
    name: 'Binance Smart Chain',
    rpcUrls: ['https://56.rpc.thirdweb.com'],
    blockExplorer: 'bscscan.com',
    contribution: {
      token: {
        address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        decimals: 18,
        symbol: 'CAKE',
        name: 'CAKE',
      },
      minAmount: BigInt(0),
      maxAmount: parseUnits('1', 18),
    },
    daoAddress: '0x273cfA50190358639ea7ab3e6bF9c91252132338',
    wnativeToken: {
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped BNB',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'BNB Token',
      symbol: 'BNB',
      decimals: 18,
    },
    dexInfo: {
      type: 'pancake',
      factoryAddress: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
      swapRouterAddress: '0x88E564D3cFf40d99C76e43434Ce293B6f545F024',
      quoterAddress: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
    },
  },
  [supportedChainIds.mode]: {
    id: supportedChainIds.mode,
    name: 'Mode',
    rpcUrls: ['https://mainnet.mode.network'],
    blockExplorer: 'testnet.modefi.com',
    contribution: {
      token: {
        address: '0x98E0AD23382184338dDcEC0E13685358EF845f30',
        decimals: 18,
        symbol: 'CARTEL',
        name: 'Ether',
      },
      minAmount: BigInt(0),
      maxAmount: parseUnits('1', 18),
    },
    daoAddress: '0xEc7b0FD288E87eBC1C301E360092c645567e79B9',
    wnativeToken: {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Ether',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'Testnet MODE Token',
      symbol: 'MODE',
      decimals: 18,
    },
    dexInfo: {
      type: 'velodrome',
      factoryAddress: '0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F',
      swapRouterAddress: '0xC3a15f812901205Fc4406Cd0dC08Fe266bF45a1E',
      quoterAddress: '0xB11f2310D1b3FF589af56b981c17BC57dee1D488',
    },
  },
};
