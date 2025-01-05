import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React from "react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";

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
          width={900}
          height={900}
          priority
          sizes="(max-width: 768px) 720px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Typography variant="h1" className={`text-center text-white text-[2rem] md:text-5xl lg:text-6xl ${syne.className}`}>
            Decentralized Autonomous<br />Agentic Organization
          </Typography>
          <Typography variant="h3" className={`pt-10 text-center text-white lg:text-xl w-5/6 md:text-lg text-base ${syne.className}`}>
            Where autonomous agents meet decentralized innovation, driving seamless collaboration for a smarter future.
          </Typography>

          <Link
            href="insert-link-here"
            target="_blank"
            className="my-12"
          >
            <Button variant="connect"
              className={`w-[300px] h-[60px] px-2 py-3 bg-white rounded-[100px] shadow-custom-button border border-[#bedaff] justify-center items-center gap-2 inline-flex"`}>
              <div className="text-center text-black text-2xl font-normal goldman leading-tight tracking-wide">
                Whitepaper
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
