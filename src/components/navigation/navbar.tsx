import Link from "next/link";
import React, { useState } from "react";
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
import { socialLinks } from "@/lib/links";

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
      <div className="flex-1 hidden items-center justify-center gap-3 lg:flex">
        <NaviLinks />
      </div>*/}

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
