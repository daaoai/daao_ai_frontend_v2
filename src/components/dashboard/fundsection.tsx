'use client';

import FundCard from '@/components/dashboard/fund-card';
import { FundDetails } from '@/types/daao';
import Carousel from '../carousel';
import { getLocalTokenDetails, getTokenDetails } from '@/utils/token';

// Lucide React icons
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/shadcn/components/ui/carousel';

interface FundSectionProps {
  chainId: number;
  funds: FundDetails[];
  onFundClick: (fundId: string) => void;
}

export function FundSection({ funds, onFundClick, chainId }: FundSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
      {/* <div className="mb-8 text-left">
        <h2 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide mb-2">{title}</h2>
        <p className="text-white text-lg sm:text-xl font-normal tracking-tight">{subtitle}</p>
      </div> */}
      <div className="relative">
        <Carousel slidesToShowConfig={{ laptop: 3, tablet: 2, mobile: 1 }}>
          {funds.map((fund, index) => {
            const tokenDetails = getLocalTokenDetails({
              address: fund.token,
              chainId,
            });
            return (
              <button
                key={index}
                title="btn"
                onClick={(e) => {
                  e.preventDefault();
                  if (fund.status === 'trading') {
                    onFundClick(fund.address);
                  }
                }}
                disabled={fund.status !== 'trading'}
                className={`block w-full px-4 h-fit ${fund.status !== 'trading' ? 'cursor-not-allowed' : ''}`}
              >
                <FundCard
                  title={fund.title}
                  token={fund.status !== 'trading' ? 'TBA' : tokenDetails.symbol}
                  uId={fund.id}
                  status={fund.status}
                  imgSrc={fund.imgSrc}
                />
              </button>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}
