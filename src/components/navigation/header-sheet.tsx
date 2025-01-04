import { useState } from "react";
import Image from "next/image";
import { MenuIcon } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggler } from "../ui/theme-toggler";
import { ConnectWalletButton } from "../ui/connect-button";
import { Typography } from "../ui/typography";
import { MobileNavLinks } from "./navbar";
import logo from '@/assets/images/logo.svg';

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
export const HeaderSheet: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <Sheet
      open={isNavbarOpen}
      onOpenChange={() => setIsNavbarOpen(!isNavbarOpen)}
    >
      <SheetTrigger asChild className="z-[500]">
        <MenuIcon className="rotate-90" />
      </SheetTrigger>

      <SheetContent className="border-neutral-600">
        <VisuallyHidden>
          <SheetTitle>Mobile Menu</SheetTitle>
          <SheetDescription>
            Navigate through the application using the mobile menu options.
          </SheetDescription>
        </VisuallyHidden>

        <div className="mb-6">
          <Logo />
        </div>

        <div className="flex flex-col items-stretch gap-2">
          <ConnectWalletButton />
          <MobileNavLinks />
        </div>

        <div className="absolute bottom-4 left-4">
          <ThemeToggler />
        </div>
      </SheetContent>
    </Sheet>
  );
};