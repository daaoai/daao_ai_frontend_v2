import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React from "react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { GitFork, StarIcon } from "lucide-react";
import { GitHubIcon } from "@/assets/icons/social";

const HomePage: NextPage = () => {
  return (
    <PageLayout title="Homepage" description="Welcome to next-web-template">
      <Typography variant="h1" className="text-center">
        Decentralized Autonomous Agentic Organiztaion
      </Typography>
      <Typography variant="h4" className="text-center">
        Where autonomous agents meet decentralized innovation, driving seamless collaboration for a smarter future.
      </Typography>

      <Link
        href="insert-link-here"
        target="_blank"
        className="my-12"
      >
        <Button className="gap-2">
          LAUNCH A DAAO
        </Button>
      </Link>

    </PageLayout>
  );
};

export default HomePage;
