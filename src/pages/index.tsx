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
      <Typography variant="h1" className={`${syne.className} text-center px-4 sm:px-8 lg:px-16 py-4`}  >
        Decentralized Autonomous Agentic Organiztaion
      </Typography>
      <Typography variant="h3" className={`${syne.className} text-center px-4 sm:px-8 lg:px-60 py-4`}>
        Where autonomous agents meet decentralized innovation, driving seamless collaboration for a smarter future.
      </Typography>

      <Link
        href="insert-link-here"
        target="_blank"
        className="my-12"
      >
        <Button variant="connect"
          className={`${gold.className} text-black bg-white shadow-custom-button gap-2 w-300 h-6 px-8 py-4 rounded-full`}>
          Whitepaper
        </Button>
      </Link>

    </PageLayout>
  );
};

export default HomePage;
