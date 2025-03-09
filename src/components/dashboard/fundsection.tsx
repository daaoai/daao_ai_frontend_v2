'use client';

import * as React from 'react';
import FundCard from '@/components/dashboard/fund-card';
import { Fund } from '@/types/fund';
import Carousel from '../carousel';

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
  title?: string;
  subtitle?: string;
  funds: Fund[];
  onFundClick: (fundId: string) => void;
}

export function FundSection({ title, subtitle, funds, onFundClick }: FundSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
      {/* <div className="mb-8 text-left">
        <h2 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide mb-2">{title}</h2>
        <p className="text-white text-lg sm:text-xl font-normal tracking-tight">{subtitle}</p>
      </div> */}
      <div className="relative">
        <Carousel slidesToShowConfig={{ laptop: 3, tablet: 2, mobile: 1 }}>
          {funds.map((fund, index) => (
            <button
              key={index}
              title="btn"
              onClick={(e) => {
                e.preventDefault();
                if (fund.status === 'trading') {
                  onFundClick(fund.id);
                }
              }}
              disabled={fund.status !== 'trading'}
              className={`block w-full px-4 h-fit ${fund.status !== 'trading' ? 'cursor-not-allowed' : ''}`}
            >
              <FundCard
                title={fund.title}
                token={fund.token || ''}
                uId={fund.id}
                status={fund.status}
                imgSrc={fund.imgSrc}
              />
            </button>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
