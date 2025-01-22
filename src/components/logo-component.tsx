import Image from "next/image";
import React from "react";
import logo from "../assets/icons/logo.svg";
import { Typography } from "./ui/typography";
import { gold } from "@/lib/fonts";

interface Props {
  width?: number,
  height?: number
}

const Logo: React.FC<Props> = ({ width = 32, height = 32 }: Props) => (
  <div className="flex justify-center items-center space-x-2">
    <Image
      src={logo}
      alt="D.A.A.O Logo"
      width={width}
      height={height}
      priority
      className="mt-1 w-5 h-5 sm:w-8 sm:h-8"
    />
    <Typography variant="h3" className={`font-bold ${gold.className} text-base sm:text-lg md:text-xl lg:text-2xl`}>
      D.A.A.O
    </Typography>
  </div>
);

export default Logo;
