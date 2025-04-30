import { chainsData } from '@/constants/chains';
import { isNativeCurrency } from '@/utils/token';
import axios from 'axios';

const useTokenPrice = () => {
  const fetchTokenPriceDexScreener = async ({ address, chainId }: { address: string; chainId: number }): Promise<number> => {
    try {
      const dexscreenerNetworkId = chainsData[chainId].dexScreenerId;
      if (!dexscreenerNetworkId) return 0;
      const response = await axios.get(`https://api.dexscreener.com/token-pairs/v1/${dexscreenerNetworkId}/${address}`);
      return Number(response.data[0].priceUsd) || 0;
    } catch (err) {
      return 0;
    }
  };
  const fetchTokenPriceGecko = async ({ address, chainId }: { address: string; chainId: number }): Promise<number> => {
    const geckNetworkId = chainsData[chainId].geckoId;
    if (!geckNetworkId) return 0;
    let addressForPrice = isNativeCurrency(address, chainId) ? chainsData[chainId].wnativeToken.address : address;
    try {
      const response = await axios.get(
        `https://api.geckoterminal.com/api/v2/simple/networks/${geckNetworkId}/token_price/${addressForPrice}`,
      );
      return Number(response.data.data.attributes.token_prices?.[addressForPrice.toLowerCase()]) || 0;
    } catch (err) {
      return 0;
    }
  };
  return { fetchTokenPriceDexScreener, fetchTokenPriceGecko };
};

export default useTokenPrice;
