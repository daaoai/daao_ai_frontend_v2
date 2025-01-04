import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from '@/assets/images/logo.svg';
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
import { Typography } from "../ui/typography";

interface NavLink {
  label: string;
  href: string;
}

const otherLinks: NavLink[] = [
  { label: "About", href: "/docs" },
  { label: "Github", href: "/docs" },
  { label: "Telegram", href: "/docs" },
  { label: "Discord", href: "/docs" },
  { label: "Twitter", href: "/docs" },
];

const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="relative h-8 w-8">
      <Image
        src={logo}
        alt="D.A.A.O Logo"
        width={32}
        height={32}
        priority
      />
    </div>
    <Typography variant="h3" className="font-bold">
      D.A.A.O
    </Typography>
  </div>
);

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
    <div className="fixed z-50 flex w-full justify-between items-center border-b border-neutral-400/50 bg-white/50 p-4 backdrop-blur-xl dark:bg-black/50 md:px-16 md:py-4">
      <div className="flex-1 hidden md:block">
        <Link href="/" className="flex items-center justify-start">
          <Logo />
        </Link>
      </div>

      <Link href="/" className="md:hidden">
        <Logo />
      </Link>

      <div className="flex-1 justify-center hidden items-center gap-3 lg:flex">
        <NaviLinks />
      </div>

      <div className="flex-1 justify-end items-center gap-3 hidden lg:flex">
        <ThemeToggler />
        <ConnectWalletButton />
      </div>

      <div className="block lg:hidden">
        <HeaderSheet />
      </div>
    </div>
  );
};