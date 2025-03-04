'use client';
import * as React from 'react';
import FundCard from '@/components/dashboard/fund-card';
import { Fund } from '@/types/fund';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
      >
        {funds.map((fund) => (
          <SwiperSlide key={fund.id} className="p-2">
            <button
              title="btn"
              onClick={(e) => {
                e.preventDefault();
                if (fund.status === 'trading' && onFundClick) {
                  onFundClick(fund.id);
                }
              }}
              disabled={fund.status !== 'trading'}
              className={fund.status === 'trading' ? 'w-full h-full' : 'w-full h-full cursor-not-allowed'}
            >
              <FundCard
                key={fund.id}
                title={fund.title}
                token={fund.token}
                uId={fund.id}
                status={fund.status}
                imgSrc={fund.imgSrc}
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
