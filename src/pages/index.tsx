import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React from "react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { WHITEPAPER_URL } from "@/lib/links";
import { Syne_Mono } from "next/font/google";
export const syne = Syne_Mono({
  subsets: ["latin"],
  weight: "400",
})
import { Goldman } from "next/font/google";
export const gold = Goldman({
  subsets: ["latin"],
  weight: "400",
})

const HomePage: NextPage = () => {
  return (
    <PageLayout title="Homepage" description="Welcome to next-web-template">
      {/* Star Image */}
      <div className="relative flex justify-center items-center">
        <Image
          src="/star-1-with-ellipse.svg"
          alt="Star"
          width={950}
          height={950}
          priority
          sizes="(max-width: 768px) 740px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Typography variant="h1" className={`text-center text-white text-[2rem] md:text-5xl lg:text-6xl ${syne.className}`}>
            Decentralized Autonomous<br />Agentic Organization
          </Typography>
          <Typography variant="h3" className={`lg:pt-2 pt-6 text-center text-white lg:text-xl w-5/6 md:text-lg text-base ${syne.className}`}>
            Where autonomous agents meet decentralized innovation, driving seamless collaboration for a smarter future.
          </Typography>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-min">
            <Link
              href={WHITEPAPER_URL}
              target="_blank"
              className="w-full"
            >
              <Button
                variant="connect"
                className={`w-full py-4 sm:py-6 px-6 sm:px-10 bg-white rounded-lg sm:rounded-xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              >
                <div className="text-center text-black text-base sm:text-xl font-normal goldman leading-tight tracking-wide">
                  Whitepaper
                </div>
              </Button>
            </Link>
            <Link
              href="insert-link-here"
              target="_blank"
            >
              <Button
                variant="connect"
                className={`py-4 sm:py-6 px-6 sm:px-10 bg-transparent rounded-lg sm:rounded-xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              >
                <div className="flex justify-center items-center gap-2 text-center text-white text-sm sm:text-base font-normal goldman leading-tight tracking-wide">
                  Join Waitlist <ArrowRight />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
