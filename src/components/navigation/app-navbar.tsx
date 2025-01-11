import Link from "next/link";
import React from "react";
// import { HeaderSheet } from "./header-sheet";
import { ConnectWalletButton } from "@/components/ui/connect-button";
import Logo from '../logo';
import { workSans } from "@/pages/app";

export const AppNavbar: React.FC = () => {
  // const [search, setSearch] = useState("")

  return (
    <div className={`gap-6 sm:gap-12 fixed z-50 flex w-full justify-between items-center border-b border-[#212121] p-2 bg-black px-4 sm:px-8 md:px-24 lg:px-48 md:py-4`}>
      <div className="block">
        <Link href="/" className="flex items-center justify-start">
          <Logo
            width={32}
            height={32}
          />
        </Link>
      </div>

      {/* Search Bar */}
      {/*<div className="h-min flex-1 flex items-center justify-center w-full">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute top-1 left-3 text-[#d3d6d8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${workSans.className} pl-12 h-8 w-full p-2 rounded-full border border-[#27292a] bg-black/0 text-[#d3d6d8] focus:outline-none focus:ring focus:ring-white/5`}
          />
        </div>
      </div>*/}

      {/* Center Navigation Links */}
      <div className={`hidden lg:flex gap-12 w-full justify-end items-center ${workSans.className}`}>
        <Link
          href="#rewards"
          className="text-white text-xl font-medium leading-9"
        >
          Rewards
        </Link>
        <Link
          href="#forum"
          className="text-white text-xl font-medium leading-9"
        >
          Forum
        </Link>
        <Link
          href="/app/farm"
          className="text-white text-xl font-medium leading-9"
        >
          Farms
        </Link>
      </div>


      {/* The "Join Waiting" button that opens the modal */}
      <div className="justify-center items-center gap-4 w-min flex">
        <ConnectWalletButton icons={true} />
      </div>

      {/*<div className="block lg:hidden">
        <HeaderSheet />
      </div>*/}

    </div>
  );
};
