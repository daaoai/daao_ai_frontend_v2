import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { workSans } from "./fonts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string) {
  console.log("Address is ", address)

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export const handleCopy = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast({
      description: "Mode copied to clipboard!",
      className: `${workSans.className} bg-[#2ca585]`
    });
  } catch (error) {
    toast({
      variant: "destructive",
      description: "Failed to copy",
      className: `${workSans.className}`
    });
  }
};

export const commaSeparator = (value: number | string): string => {
  const array = value.toString().split(".");
  const stringWithComma = array[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return array[1] ? `${stringWithComma}.${array[1]}` : stringWithComma;
};
