import Link from 'next/link';
import React from 'react';
import Logo from '../logo-component';
import { ConnectWalletButton } from '../connect-button';

interface NavbarProps {
  app?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ app = false }) => {
  return (
    <div className="gap-6 sm:gap-12 fixed z-50 flex w-full justify-between items-center border-b border-[#212121] p-4 bg-black px-4 sm:px-8 md:py-4">
      <div className="block">
        <Link href="/" className="flex items-center justify-start">
          <Logo width={32} height={32} app={app} />
        </Link>
      </div>
      <div className="hidden sm:flex gap-12 w-full justify-end items-center">
        <Link href="/dapp/farms" className="text-white sm:text-base md:text-lg lg:text-xl font-medium leading-9">
          Farms
        </Link>
      </div>
      <div className="justify-center items-center gap-4 w-min flex">
        <ConnectWalletButton icons={true} />
      </div>
    </div>
  );
};

export default Navbar;
