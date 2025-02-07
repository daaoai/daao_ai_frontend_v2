import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React, { useState } from "react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CURRENT_DAO_IMAGE, DefaiCartelLinks, WHITEPAPER_URL } from "@/lib/links";
import { FooterIconLink } from "@/components/footer";
import { gold, syne } from "@/lib/fonts";
// import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CheckWaitlistModal from "@/components/landing/waitlist-modal";


const HomePage: NextPage = () => {
  // const [email, setEmail] = useState("");
  // const [statusMsg, setStatusMsg] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  // const isValidEmail = (value: string) => {
  //   // Check if the address starts with '0x' and is 42 characters long
  //   if (value.length !== 42 || !value.startsWith('0x')) {
  //     return false;
  //   }
  //
  //   // Check if the remaining characters are valid hexadecimal characters
  //   const hexPart = value.slice(2); // Remove '0x'
  //   const hexRegex = /^[0-9a-fA-F]+$/;
  //
  //   return hexRegex.test(hexPart);
  // };

  // Function to handle the API call
  // const handleJoinWaitlist = async () => {
  //   if (!email.trim()) {
  //     setStatusMsg("Please enter your mode address")
  //     return;
  //   }
  //
  //   // Check if email is valid
  //   if (!isValidEmail(email)) {
  //     setStatusMsg("Please enter a valid mode address");
  //     return;
  //   }
  //   try {
  //     const response = await fetch("/api/auth/joinWaitList", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email }),
  //     });
  //
  //     if (!response.ok) {
  //       const err = await response.json();
  //       console.error("Error: ", err.error);
  //       setStatusMsg("Failed to join waitlist");
  //       return;
  //     }
  //
  //     // Clear the input
  //     setEmail("");
  //     setStatusMsg("You have been added to the waitlist!");
  //   } catch (error) {
  //     // console.error("Error joining waitlist:", error);
  //     setStatusMsg("Something went wrong, please try again later");
  //   }
  // };

  const handleGoToApp = async () => {
      window.location.href = "/app/";
  };


  return (
    <PageLayout title="Homepage" description="Welcome to a Network of Decentralized Autonomous Agentic Organizations">
      {/* Star Image */}
      <div className="sm:my-[-40px] relative flex justify-center items-center h-max">
        <Image
          src="/assets/star-1-with-ellipse.svg"
          alt="Star"
          width={950}
          height={950}
          priority
          sizes="(max-width: 768px) 740px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Typography variant="h1" className={`text-center text-white text-3xl md:text-5xl lg:text-6xl ${syne.className}`}>
            Decentralized Autonomous<br />Agentic Organization
          </Typography>
          <Typography variant="h3" className={`lg:pt-6 pt-2 text-center text-white lg:text-xl w-5/6 md:text-lg text-sm ${syne.className}`}>
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
                className={`w-full py-4 sm:py-6 px-6 sm:px-10 bg-white rounded-lg border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              >
                <div className={`text-center text-black text-base sm:text-xl font-normal ${gold.className} leading-tight tracking-wide`}>
                  Whitepaper
                </div>
              </Button>
            </Link>
            <Button
              variant="connect"
              className={`py-4 sm:py-6 px-6 sm:px-10 bg-transparent rounded-lg xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              onClick={handleGoToApp}
            >
              <div className="flex justify-center items-center gap-2 text-center text-white text-sm sm:text-base font-normal goldman leading-tight tracking-wide">

                Go To App <ArrowRight />
              </div>
            </Button>
          </div>
        </div>
      </div>

      <CheckWaitlistModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/*waitlist*/}
      <Card className="w-[calc(100%-2rem)] max-w-[500px] bg-gradient-to-br from-black via-[#061023] to-[#0e070e] rounded-2xl shadow-[0px_4px_36px_0px_rgba(255,255,255,0.10)] border border-[#212121]">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-6 sm:p-8">
          <div className="relative w-full max-w-[250px] aspect-square rounded-xl overflow-hidden">
            <Image
              src={CURRENT_DAO_IMAGE}
              alt="DeFAI Cartel"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <Link href="/app">
          <div className="flex flex-col items-center gap-2">
        
            <h2 className={`text-center text-white text-xl sm:text-2xl font-normal ${gold.className} leading-tight tracking-wide`}>
              DeFAI Cartel
            </h2>
          
            <p className={`text-[#d1ea48] text-lg sm:text-xl font-normal ${gold.className}`}>
              $CARTEL
            </p>
          </div>
          </Link>

          {/*
          {statusMsg && (
            <div className={`text-center ${statusMsg.includes("added") ? "text-green-500" : "text-red-500"} text-sm font-normal`}>
              {statusMsg}
            </div>
          )}

          <div className="flex flex-col items-center gap-3 w-full max-w-[300px]">
            <Input
              type="email"
              placeholder="Mode address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#212121] text-[#9e9e9e] placeholder:text-[#9e9e9e] rounded-full text-sm"
            />
            <Button
              className="w-full rounded-full bg-white text-black hover:bg-gray-200 text-sm"
              onClick={handleJoinWaitlist}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              <span>Join whitelist</span>
            </Button>
          </div>
            */}
          <div className="flex flex-wrap justify-center gap-4">
            {DefaiCartelLinks.map((social, index) => (
              <FooterIconLink key={index} href={social.href} label={social.label}>
                {social.children}
              </FooterIconLink>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default HomePage;
