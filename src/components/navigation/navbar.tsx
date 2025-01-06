import Link from "next/link";
import React from "react";
import { ThemeToggler } from "../ui/theme-toggler";
import { Button } from "../ui/button";
import { HeaderSheet } from "./header-sheet";
import { ConnectWalletButton } from "@/components/ui/connect-button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Logo from '../logo';
import socialLinks from "@/lib/social-links";

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
  return (
    <div className="fixed z-50 flex w-full justify-between items-center border-b border-[#212121] p-4 backdrop-blur bg-black/0 md:px-16 md:py-4">
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
        <NaviLinks />
      </div>*/}

      <div className="justify-center items-center hidden lg:flex h-min">
        <Link
          href="insert-link-here"
          target="_blank"
        >
          <Button variant="connect"
            className={`py-5 px-12 w-full md:w-48 h-10 md:h-8 bg-white rounded-xl border border-[#bedaff] justify-center items-center inline-flex`}>
            <div className="text-center text-black text-xl font-normal leading-tight tracking-wide">
              Join Waitlist
            </div>
          </Button>
        </Link>
      </div>

      <div className="block lg:hidden">
        <HeaderSheet />
      </div>
    </div>
  );
};
