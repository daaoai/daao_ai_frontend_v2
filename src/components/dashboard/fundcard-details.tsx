import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Copy } from 'lucide-react';
import { workSans } from '@/lib/fonts';

const FundDetails: React.FC<FundDetailsProps> = (props) => {

  return (
    <>
      <Card className="bg-[#0d0d0d] text-white p-4 sm:p-6 max-w-2xl mx-auto">
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
            <div className='flex flex-col gap-4 sm:gap-7 justify-start items-center w-full'>
              <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full">
                <CardContent className="space-y-1 sm:space-y-2 px-2 sm:px-3">
                  <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Market Cap</p>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">$2,500,139</p>
                  <p className="text-[#39db83] text-xs sm:text-sm md:text-lg lg:text-xl">+2,391,285 (1283%)</p>
                </CardContent>
              </Card>
              <div className="flex items-center gap-2 text-[#498ff8] text-sm sm:text-base md:text-xl">
                <span>0xD0...85b9</span>
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <Card className="bg-[#1b1c1d] border-[#27292a] p-2 sm:p-4 w-full">
              <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-3">
                <div>
                  <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Holdings</p>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold">{props.holdings} {props.shortname} <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">(0%)</span></p>
                </div>
                <div>
                  <p className="text-[#aeb3b6] text-sm sm:text-base md:text-lg lg:text-xl">Your Market Value</p>
                  <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold">$0.00</p>
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
