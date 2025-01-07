import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
// import { HeaderSheet } from "./header-sheet";
import { ConnectWalletButton } from "@/components/ui/connect-button";
import { Search } from "lucide-react";
import Logo from '../logo';
import { workSans } from "@/pages/app";
import { ConnectButtonRenderer } from "@rainbow-me/rainbowkit/dist/components/ConnectButton/ConnectButtonRenderer";

export const AppNavbar: React.FC = () => {
  const [search, setSearch] = useState("")

  return (
    <div className={`gap-4 sm:gap-4 fixed z-50 flex w-full md:justify-between justify-center items-center border-b border-[#212121] p-2 bg-black/0 md:px-[150px] lg:px-[200px] md:py-4`}>
      <div className="block">
        <Link href="/" className="flex items-center justify-start">
          <Logo
            width={32}
            height={32}
          />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="h-min flex-1 flex items-center justify-center w-full">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute top-1 left-3 text-[#d3d6d8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${workSans.className} pl-12 h-8 w-full p-2 rounded-full border border-[#27292a] bg-black/0 text-[#d3d6d8] focus:outline-none focus:ring focus:ring-white/5`}
          />
        </div>
      </div>

      {/* The "Join Waiting" button that opens the modal */}
      <div className="justify-center items-center gap-4 w-min flex">
        <ConnectWalletButton />
      </div>

      {/*<div className="block lg:hidden">
        <HeaderSheet />
      </div>*/}

    </div>
  );
};
