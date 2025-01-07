import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
// import { HeaderSheet } from "./header-sheet";
// import { ConnectWalletButton } from "@/components/ui/connect-button";
import Logo from '../logo';

export const AppNavbar: React.FC = () => {
  return (
    <div className={`fixed z-50 flex w-full justify-between itemr-center border-b border-[#212121] p-4 backdrop-blur bg-black/0 md:px-16 md:py-4`}>
      <div className="flex-1 hidden md:block">
        <Link href="/" className="flex items-center justify-start">
          <Logo
            width={32}
            height={32}
          />
        </Link>
      </div>

      <Link href="/" className="md:hidden">
        <Logo
          width={32}
          height={32}
        />
      </Link>

      {/* The "Join Waiting" button that opens the modal */}
      <div className="justify-center items-center gap-4 w-min flex">
        <Button
          variant="connect"
          className={`w-full py-4 md:py-2 md:px-6 px-4 bg-white rounded-lg sm:rounded-xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
        >
          <div className="text-center text-black text-xs sm:text-base font-normal goldman leading-tight tracking-wide">
            meow?
          </div>
        </Button>
      </div>

      {/*<div className="block lg:hidden">
        <HeaderSheet />
      </div>*/}

    </div>
  );
};
