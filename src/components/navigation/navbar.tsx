import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "@/assets/images/logo.svg";
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
      <Image src={logo} alt="D.A.A.O Logo" width={32} height={32} priority />
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
  // 1. State to manage modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. State to hold the user's email input
  const [email, setEmail] = useState("");
  const isValidEmail = (value: string) => {
    // Basic pattern: something@something.something
    // You can strengthen this regex if needed.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };


  // 3. Function to handle the API call
  const handleJoinWaitlist = async () => {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch("/api/auth/joinWaitList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Failed to join waitlist");
        return;
      }

      // Clear the input, close modal, show success
      setEmail("");
      setIsModalOpen(false);
      alert("Thanks for joining the waitlist!");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="fixed z-50 flex w-full items-center justify-between border-b border-neutral-400/50 bg-white/50 p-4 backdrop-blur-xl dark:bg-black/50 md:px-16 md:py-4">
      <div className="flex-1 hidden md:block">
        <Link href="/" className="flex items-center justify-start">
          <Logo />
        </Link>
      </div>

      <Link href="/" className="md:hidden">
        <Logo />
      </Link>

      <div className="flex-1 hidden items-center justify-center gap-3 lg:flex">
        <NaviLinks />
      </div>

      <div className="flex-1 hidden items-center justify-end gap-3 lg:flex">
        <ThemeToggler />
        <ConnectWalletButton />
      </div>

      {/* The "Join Waiting" button that opens the modal */}
      <div className="flex-1 hidden items-center justify-end gap-3 lg:flex">
        <button onClick={() => setIsModalOpen(true)}>Join Waiting</button>
      </div>

      <div className="block lg:hidden">
        <HeaderSheet />
      </div>

      {/* Conditional Rendering of the Modal */}
      {isModalOpen && (
        <div className="fixed h-screen inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full  max-w-sm rounded-md bg-white p-6 shadow-lg dark:bg-neutral-800">
            <h2 className="mb-4 text-xl font-semibold dark:text-white">
              Join the Waitlist
            </h2>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border p-2 focus:outline-none dark:bg-neutral-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinWaitlist}>Join</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
