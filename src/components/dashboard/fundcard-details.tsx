import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Copy } from 'lucide-react';
import { workSans } from '@/lib/fonts';
import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import daoABI from "../../DaoABI.json"
import { commaSeparator, handleCopy, shortenAddress } from '@/lib/utils';
import { getContractData } from "../../getterFunctions"
import { useFundContext } from "./FundContext";
import { useAccount } from 'wagmi';
import Liquidity from '../Liquidity/liquidity';
import { ethers } from 'ethers';
import contractABI from "../../abi.json";




const FundDetails: React.FC<FundDetailsProps> = (props) => {

  interface TokenChangeState {
    percent: number;
    token: number;
  }

  const { daoBalance } = useFundContext();
  const { isConnected } = useAccount();
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [daoTokenAddress, setDaoTokenAddress] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [daoHoldings, setDaoHoldings] = useState('0');
  const { priceUsd, setPriceUsd } = useFundContext();
  const [tokenChange, setTokenChange] = useState<TokenChangeState>({
    percent: 0,
    token: 0
  });

  // useEffect(() => {
  //   const fetchContractData = async () => {
  //     try {
  //       const data = await getContractData()
  //       if (data?.daoToken) {
  //         setDaoTokenAddress(data.daoToken)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching contract data:', error)
  //     }
  //   }
  //   fetchContractData()
  // }, [isConnected])


  // useEffect(() => {
  //   const fetchDaoBalance = async () => {
  //     if (!daoTokenAddress) return
  //     if (typeof window === 'undefined' || !(window as any).ethereum) return

  //     try {
  //       await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
  //       const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  //       const signer = provider.getSigner()
  //       const userAddress = await signer.getAddress()

  //       const daoContract = new ethers.Contract(daoTokenAddress, daoABI, provider)
  //       const balanceBN = await daoContract.balanceOf(userAddress)
  //       const balanceFormatted = ethers.utils.formatUnits(balanceBN, 18)
  //       console.log("Balance is pikcachuuuuuu ", daoBalance)
  //       setDaoHoldings(daoBalance)
  //     } catch (error) {
  //       console.error('Error fetching DAO balance:', error)
  //     }
  //   }
  //   fetchDaoBalance()
  // }, [daoTokenAddress])

  const calculateTokenChange = (marketCap: number, percentageChange: number): number => {
    return (marketCap * percentageChange) / 100;
  };

  useEffect(() => {
    const modeRpc = "https://mainnet.mode.network/";
    const daoAddress = "0xEc7b0FD288E87eBC1C301E360092c645567e79B9"
    const fetchMarketData = async () => {

      const provider = new ethers.providers.JsonRpcProvider(modeRpc);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(daoAddress as string, contractABI, provider);
      const daoToken = (await contract.daoToken());
      setDaoTokenAddress(daoToken)
      // if (!daoTokenAddress) return


      // const url = `https://api.dexscreener.com/token-pairs/v1/mode/${daoTokenAddress}`
      const url = `https://api.dexscreener.com/token-pairs/v1/mode/${daoToken}`
      console.log("url is ", url)
      try {
        // Replace with your actual endpoint or logic
        const response = await fetch(
          url,
        )
        const data = await response.json()
        console.log("Data from api is  is ", data)

        if (data && Array.isArray(data) && data[0]) {
          setPrice(data[0].priceUsd)
          setPriceUsd(data[0].priceUsd)
          // setPriceUsd(23)
          // const marketCap = (Number(data[0].priceUsd) * 10 ** 9).toFixed(0)
          const marketCap = (Number(data[0].marketCap)).toFixed(0)
          setMarketCap(Number(marketCap));
          const percentageChange = (Number(data?.[0]?.priceChange?.h24))
          const tokenChangeValue = calculateTokenChange(Number(marketCap), percentageChange);
          setTokenChange({
            percent: percentageChange,
            token: tokenChangeValue
          });
        } else {
          console.warn('Market data not in expected format.')
        }
      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }
    fetchMarketData()
    // }, [daoTokenAddress, setPriceUsd])
  }, [setPriceUsd])

  return (
    <Card className="bg-[#0d0d0d] text-white sm:p-2  w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex-shrink-0 overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src={props.icon}
              width={70}
              height={70}
              alt={`${props.longname} icon`}
            />
          </div>
          <CardTitle className={`text-xl sm:text-2xl md:text-3xl font-semibold ${workSans.className}`}>
            ${props.shortname} {props.longname}
          </CardTitle>
        </div>

        <Liquidity />

      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">

        <Card className="bg-[#1b1c1d] border-[#27292a] w-full">
          <CardContent className="pt-6">
            <p className=" text-sm sm:text-base md:text-lg lg:text-lg text-left">
              {props?.description}
            </p>
          </CardContent>
        </Card>


        <div className="text-left flex flex-row gap-4 sm:gap-6">
          <div className="grid grid-rows-[80%_20%] gap-2 sm:gap-1 w-full">
            <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full h-[max-content]">
              <CardContent className="space-y-1 sm:space-y-2 px-2 sm:px-3 pb-0">
                <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Market Cap</p>
                <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">${commaSeparator(marketCap || 0)}</p>
                <p
                  className={`text-lg sm:text-lg md:text-xl lg:text-2xl font-semibold ${tokenChange?.percent < 0 ? "text-red-600" : "text-green-600"
                    }`}
                >
                  {`${commaSeparator(Number(tokenChange?.token || 0).toFixed(2))} (${Number(tokenChange?.percent || 0).toFixed(2)}%)`}
                </p>
              </CardContent>
            </Card>
            <div className="h-min flex justify-center items-center gap-2 text-[#498ff8] text-sm sm:text-base md:text-xl mt-2">
              <span>{shortenAddress(daoTokenAddress)}</span>
              <Copy className="w-4 h-4 sm:w-5 sm:h-5 hover:cursor-pointer" onClick={() => handleCopy(props.modeAddress)} />
            </div>
          </div>

          <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full">
            <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-3 p-0">
              <div>
                <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Holdings</p>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">{Number(daoBalance).toFixed(2)} {props.shortname} <span className="text-sm sm:text-lg md:text-xl lg:text-2xl"></span></p>
              </div>
              <div>
                <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Market Value</p>
                <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">${(Number(daoBalance) * Number(price)).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundDetails;
