import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Copy } from 'lucide-react';
import { workSans } from '@/lib/fonts';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import daoABI from "../../DaoABI.json"
import { handleCopy, shortenAddress } from '@/lib/utils';


const DAO_TOKEN_ADDRESS = '0xeadDc1199350bC3eAa586124eC84821b3fe586a1212';

const FundDetails: React.FC<FundDetailsProps> = (props) => {



  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);


  const [daoHoldings, setDaoHoldings] = useState('0');


  useEffect(() => {
    const fetchDaoBalance = async () => {
      try {
        if ((window as any).ethereum) {
          await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

          const provider = new ethers.providers.Web3Provider((window as any).ethereum);
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          const daoContract = new ethers.Contract(DAO_TOKEN_ADDRESS, daoABI, provider);
          const balanceBN = await daoContract.balanceOf(userAddress);
          const balanceFormatted = ethers.utils.formatUnits(balanceBN, 18);
          setDaoHoldings(balanceFormatted);
        } else {
          console.warn('No crypto wallet (window.ethereum) found');
        }
      } catch (error) {
        console.error('Error fetching DAO balance:', error);
      }
    };

    fetchDaoBalance();
  }, []);

  useEffect(() => {
    const fetchMarketCap = async () => {
      try {
        const response = await fetch(
          `https://api.dexscreener.com/tokens/v1/mode/${props.modeAddress}?include_market_cap=true`
        );
        const data = await response.json();
        console.log(data);
        if (data) {
          setMarketCap(data[0].marketCap);
          setPrice(data[0].priceUsd);

        } else {
          console.warn('Market cap data not found for my-token');
        }
      } catch (error) {
        console.error('Error fetching market cap:', error);
      }
    };

    fetchMarketCap();
  }, []);
  return (
    <>
      <Card className="bg-[#0d0d0d] text-white sm:p-2 max-w-xl lg:max-w-2xl mx-auto w-full">
        <CardHeader className="flex flex-row items-center gap-4 sm:gap-6 pb-4 sm:pb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex-shrink-0 overflow-hidden">
            <Image
              className="w-full h-full object-cover border border-[#27292a]"
              src={props.icon}
              width={70}
              height={70}
              alt={`${props.longname} icon`}
            />
          </div>
          <CardTitle className={`text-xl sm:text-2xl md:text-3xl font-semibold ${workSans.className}`}>
            ${props.shortname} ({props.longname})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <Card className="bg-[#1b1c1d] border-[#27292a] p-3 sm:p-4">
            <CardDescription className={`text-left text-white text-sm sm:text-base md:text-lg font-normal ${workSans.className}`}>
              {props.description}
            </CardDescription>
          </Card>

          <div className="text-left flex flex-row gap-4 sm:gap-6">
            <div className="grid grid-rows-[80%_20%] gap-2 sm:gap-4 w-full">
              <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full">
                <CardContent className="space-y-1 sm:space-y-2 px-2 sm:px-3">
                  <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Market Cap</p>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">${marketCap}</p>
                </CardContent>
              </Card>
              <div className="h-min flex justify-center items-center gap-2 text-[#498ff8] text-sm sm:text-base md:text-xl">
                <span>{shortenAddress(props.modeAddress)}</span>
                <Copy className="w-4 h-4 sm:w-5 sm:h-5 hover:cursor-pointer" onClick={() => handleCopy(props.modeAddress)} />
              </div>
            </div>

            <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full">
              <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-3">
                <div>
                  <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Holdings</p>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">{Number(daoHoldings).toFixed(3)} {props.shortname} <span className="text-sm sm:text-lg md:text-xl lg:text-2xl"></span></p>
                </div>
                <div>
                  <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Market Value</p>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">${(Number(daoHoldings) * Number(price)).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FundDetails;
