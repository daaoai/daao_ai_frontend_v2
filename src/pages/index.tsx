import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React from "react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { GitFork, StarIcon } from "lucide-react";
import { GitHubIcon } from "@/assets/icons/social";

import { Syne } from "next/font/google";
const syne = Syne({
  subsets: ["latin"],
  weight: "400",
})

import { Goldman } from "next/font/google";
const gold = Goldman({
  subsets: ["latin"],
  weight: "400",
})

const HomePage: NextPage = () => {
  return (
    <PageLayout title="Homepage" description="Welcome to next-web-template">
      <Typography variant="h1" className={`text-center text-[#d5ddf3] text-[70px] font-normal ${syne.className}`}>
        Decentralized Autonomous<br />Agentic Organization
      </Typography>
      <Typography variant="h3" className={`w-[790px] text-center text-[#d5ddf3] text-2xl font-normal ${syne.className}`}>
        Where autonomous agents meet decentralized innovation, driving seamless collaboration for a smarter future.
      </Typography>

      <Link
        href="insert-link-here"
        target="_blank"
        className="my-12"
      >
        <Button variant="connect"
          className={`w-[300px] h-[60px] px-2 py-3 bg-white rounded-[100px] shadow-[4px_4px_20px_0px_rgba(255,255,255,0.28)] shadow-[-4px_-4px_40px_0px_rgba(255,255,255,0.28)] border border-[#bedaff] justify-center items-center gap-2 inline-flex"`}>
          <div className="text-center text-black text-2xl font-normal goldman leading-tight tracking-wide">
            Whitepaper
          </div>
        </Button>
      </Link>

    </PageLayout>
  );
};

export default HomePage;
