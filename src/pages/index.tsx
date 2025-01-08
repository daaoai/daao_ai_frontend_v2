import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { NextPage } from "next/types";
import React, { useState } from "react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { socialLinks, WHITEPAPER_URL } from "@/lib/links";
import { Syne_Mono } from "next/font/google";
export const syne = Syne_Mono({
  subsets: ["latin"],
  weight: "400",
})
import { Goldman } from "next/font/google";
import WaitlistModal from "@/components/waitlist-modal";
import { FooterIconLink } from "@/components/footer";
export const gold = Goldman({
  subsets: ["latin"],
  weight: "400",
})

const HomePage: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const isValidEmail = (value: string) => {
    // Check if the address starts with '0x' and is 42 characters long
    if (value.length !== 42 || !value.startsWith('0x')) {
      return false;
    }

    // Check if the remaining characters are valid hexadecimal characters
    const hexPart = value.slice(2); // Remove '0x'
    const hexRegex = /^[0-9a-fA-F]+$/;

    return hexRegex.test(hexPart);
  };

  // Function to handle the API call
  const handleJoinWaitlist = async () => {
    if (!email.trim()) {
      setStatusMsg("Please enter your mode address")
      return;
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      setStatusMsg("Please enter a valid mode address");
      return;
    }
    // try {
    //   const response = await fetch("/api/auth/joinWaitList", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email }),
    //   });
    //
    //   if (!response.ok) {
    //     const err = await response.json();
    //     console.error("Error: ", err.error);
    //     setStatusMsg("Failed to join waitlist");
    //     return;
    //   }
    //
    //   // Clear the input
    //   setEmail("");
    //   setStatusMsg("You have been added to the waitlist!");
    // } catch (error) {
    //   // console.error("Error joining waitlist:", error);
    //   setStatusMsg("Something went wrong, please try again later");
    // }
    setEmail("");
    setStatusMsg("You have been added to the waitlist!");
  };



  return (
    <PageLayout title="Homepage" description="Welcome to a Network of Decentralized Autonomous Agentic Organizations">
      {/* Star Image */}
      <div className="sm:my-[-40px] relative flex justify-center items-center h-max">
        <Image
          src="/star-1-with-ellipse.svg"
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
                className={`w-full py-4 sm:py-6 px-6 sm:px-10 bg-white rounded-lg sm:rounded-xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              >
                <div className="text-center text-black text-base sm:text-xl font-normal goldman leading-tight tracking-wide">
                  Whitepaper
                </div>
              </Button>
            </Link>
            <Link
              href="#waitlist"
            >
              <Button
                variant="connect"
                className={`py-4 sm:py-6 px-6 sm:px-10 bg-transparent rounded-lg sm:rounded-xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
              >
                <div className="flex justify-center items-center gap-2 text-center text-white text-sm sm:text-base font-normal goldman leading-tight tracking-wide">
                  Register for whitelist <ArrowRight />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/*waitlist*/}
      <div
        id="waitlist"
        className="z-10 lg:[600px] md:w-[550px] sm:w-[500px] w-[350px] min-h-min px-6 pb-16 pt-4 bg-gradient-to-br from-black via-[#061023] to-[#0e070e] rounded-3xl shadow-[0px_4px_36px_0px_rgba(255,255,255,0.10)] border border-[#212121] flex-col justify-center items-center gap-9 inline-flex"
      >
        <div className="h-min flex-col justify-center items-center gap-2.5 flex">
          <div className={`w-2/3 sm:w-1/2 max-w-xs md:max-w-sm lg:max-w-md h-52 sm:h-56 md:h-64 lg:h-72 bg-purple/50 rounded-md flex-col justify-center items-center inline-flex overflow-hidden`}>
            <img className="w-full h-full" src="/microscope.png" />
          </div>
          <div className="text-center text-white text-lg sm:text-xl md:text-2xl font-normal">
            Onchain Research DAO ($RND)
          </div>
          <div className="px-2 sm:px-4 md:px-6 text-center text-white text-xs sm:text-sm font-normal">
            Finding and funding cutting-edge experimental onchain AI across the Ethereum and EVM community.
          </div>
        </div>
        <div className={`flex flex-col gap-4 text-center ${statusMsg.includes("added") ? "text-green-700" : "text-red-700"} text-xl font-normal`}>
          {statusMsg}
        </div>
        <div className="flex items-center">
          <div className="h-10 sm:h-12 px-5 py-3.5 bg-[#212121] rounded-l-full flex items-center">
            <input
              type="email"
              placeholder="Mode address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-[#9e9e9e] text-sm sm:text-base font-normal leading-tight outline-none w-full placeholder:text-[#9e9e9e]"
            />
          </div>
          <button
            className="flex items-center px-4 sm:py-2 py-1 bg-white rounded-full ml-[-20px] shadow-md"
            onClick={handleJoinWaitlist}
          >
            <div className="w-8 h-8 flex justify-center items-center bg-white rounded-full border border-black">
              <ArrowRight className="w-4 h-4 text-black" />
            </div>
            <span className="text-black md:text-base text-sm font-medium leading-tight ml-2">
              Register for whitelist
            </span>
          </button>
        </div>
        {/* Social Icons */}
        <div className="flex flex-row gap-4">
          {socialLinks.map((social, index) => (
            <FooterIconLink key={index} href={social.href} label={social.label}>
              {social.children}
            </FooterIconLink>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;
