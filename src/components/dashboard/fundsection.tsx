'use client';

import * as React from 'react';
import FundCard from '@/components/dashboard/fund-card';
import { Fund } from '@/types/fund';

// Lucide React icons
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shadcn/components/ui/carousel';

interface FundSectionProps {
  title?: string;
  subtitle?: string;
  funds: Fund[];
  onFundClick: (fundId: string) => void;
}

export function FundSection({ title, subtitle, funds, onFundClick }: FundSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
      <div className="mb-8 text-left">
        <h2 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide mb-2">{title}</h2>
        <p className="text-white text-lg sm:text-xl font-normal tracking-tight">{subtitle}</p>
      </div>
      <div className="relative">
        <Carousel className="overflow-hidden">
          <CarouselContent className="flex transition-transform duration-200 -mx-2">
            {funds.map((fund, index) => (
              <CarouselItem key={fund.id} className="px-2 w-full sm:w-1/2 md:w-1/3 flex-shrink-0">
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
                  className={`block w-fit h-fit ${fund.status !== 'trading' ? 'cursor-not-allowed' : ''}`}
                >
                  <FundCard
                    title={fund.title}
                    token={fund.token}
                    uId={fund.id}
                    status={fund.status}
                    imgSrc={fund.imgSrc}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Previous Button (moved further left) */}
          <CarouselPrevious
            aria-label="Previous Slide"
            className="
              absolute
              left-8
              top-1/2
              -translate-y-1/2
              z-10
              bg-white
              text-black
              rounded-full
              p-1
              shadow
              hover:bg-gray-200
              focus:outline-none
            "
          >
            <span className="sr-only">Previous Slide</span>
            <ChevronLeft className="w-8 h-8" />
          </CarouselPrevious>

          {/* Next Button (moved further right) */}
          <CarouselNext
            aria-label="Next Slide"
            className="
              absolute
              right-8
              top-1/2
              -translate-y-1/2
              z-10
              bg-white
              text-black
              rounded-full
              p-1
              shadow
              hover:bg-gray-200
              focus:outline-none
            "
          >
            <span className="sr-only">Next Slide</span>
            <ChevronRight className="w-8 h-8" />
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  );
}
