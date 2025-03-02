import axios from 'axios';

const useTokenPrice = () => {
  const fetchTokenPrice = async (address: `0x${string}`) => {
    try {
      const response = await axios.get(`https://api.dexscreener.com/token-pairs/v1/mode/${address}`);
      return response.data[0].priceUsd;
    } catch (err) {
      console.log('error is ', err);
      return null;
    }
  };
  return { fetchTokenPrice };
};

export default useTokenPrice;
