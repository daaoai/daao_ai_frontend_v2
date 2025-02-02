'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import FundCard from '@/components/dashboard/fund-card'
import { anekLatin } from '@/lib/fonts'

interface FundSectionProps {
  title: string
  subtitle: string
  funds: Array<{
    id: string
    title: string
    buzz: string
    token: string
    isLive: boolean
    imgSrc: string
  }>
  linkPrefix?: string
  onFundClick: (fundId: string) => void
}

export function FundSection({ title, subtitle, funds, linkPrefix = "dashboard",onFundClick }: FundSectionProps) {
  const [api, setApi] = React.useState<any>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="mb-8 text-left">
        <h2 className={`text-white text-2xl sm:text-3xl font-semibold ${anekLatin.className} tracking-wide mb-2`}>
          {title}
        </h2>
        <p className="text-white text-lg sm:text-xl font-normal tracking-tight">
          {subtitle}
        </p>
      </div>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
        {funds.map((fund) => (
            <CarouselItem key={fund.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <button
                  onClick={(e) => {
                    if (onFundClick) {
                      e.preventDefault(); // Prevent default link behavior
                      onFundClick(fund.id);
                    }
                  }}
                  className="w-full"
                >
                  <FundCard
                    key={fund.id}
                    title={fund.title}
                    buzz={fund.buzz}
                    token={fund.token}
                    isLive={fund.isLive}
                    imgSrc={fund.imgSrc}
                  />
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="sm:visible" />
        <CarouselNext className="sm:visible" />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </section>
  )
}

