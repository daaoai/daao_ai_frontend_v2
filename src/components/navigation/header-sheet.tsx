import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ConnectWalletButton } from "../ui/connect-button";
import { MobileNavLinks } from "./navbar";
import Logo from "../logo";

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
          <Logo
            width={32}
            height={32}
          />
        </div>

        <div className="flex flex-col items-stretch gap-2">
          <ConnectWalletButton />
          <MobileNavLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
};
