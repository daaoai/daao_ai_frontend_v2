import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
// import { HeaderSheet } from "./header-sheet";
// import { ConnectWalletButton } from "@/components/ui/connect-button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Logo from '../logo';
import { socialLinks } from "@/lib/links";
import WaitlistModal from "../waitlist-modal";

interface NavLink {
  label: string;
  href: string;
}

const otherLinks: NavLink[] = [
  { label: "About", href: "/docs" },
  ...socialLinks
];

export const NaviLinks: React.FC = () => (
  <NavigationMenu>
    <NavigationMenuList>
      {otherLinks.map((navLink, index) => (
        <NavigationMenuItem key={index}>
          <Link href={navLink.href} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              {navLink.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

export const MobileNavLinks: React.FC = () => (
  <>
    {otherLinks.map((navLink, index) => (
      <Link key={index} href={navLink.href} passHref>
        <Button className="w-full">{navLink.label}</Button>
      </Link>
    ))}
  </>
);

export const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publickey, setPublicKey] = useState("");

  return (
    <div className={`fixed z-50 flex w-full justify-between items-center border-b border-[#212121] p-4 bg-[#010d1f] md:px-16 md:py-4`}>
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

      {/*<div className="flex-1 justify-center hidden items-center gap-3 lg:flex">
      <div className="flex-1 hidden items-center justify-center gap-3 lg:flex">
        <NaviLinks />
      </div>*/}

      {/* The "Join Waiting" button that opens the modal */}
      <div className="justify-center items-center gap-4 w-min flex">
        <Link
          href="#waitlist"
        >
          <Button
            variant="connect"
            className={`w-full py-4 md:py-2 md:px-6 px-4 bg-white rounded-lg sm:rounded-xl border border-[#bedaff] flex justify-center items-center max-w-xs sm:max-w-none`}
          >
            <div className="text-center text-black text-xs sm:text-base font-normal goldman leading-tight tracking-wide">
              Register for whitelist
            </div>
          </Button>
        </Link>
      </div>

      {/*<div className="block lg:hidden">
        <HeaderSheet />
      </div>*/}

      {/* Conditional Rendering of the Modal */}
      <WaitlistModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        publicKey={publickey}
        setPublicKey={setPublicKey}
      />
    </div>
  );
};
