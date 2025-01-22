import Image from "next/image";
import React from "react";
import logo from "../assets/icons/logo.svg";
import waitingLogo from "../assets/icons/waiting-logo.svg";
import { Typography } from "./ui/typography";
import { gold } from "@/lib/fonts";

interface Props {
  width?: number,
  height?: number,
  app?: boolean,
  footer?: boolean,
}

const Logo: React.FC<Props> = ({ width = 32, height = 32, app = false, footer = false }: Props) => (
  <div className="flex justify-center items-center space-x-2">
    <Image
      src={app ? logo : waitingLogo}
      alt="D.A.A.O Logo"
      width={width}
      height={height}
      priority
      className={`mt-1 w-5 h-5 sm:w-8 sm:h-8 ${footer ? "md:w-10 md:h-10" : ""}`}
    />
    <Typography variant="h3" className={`font-bold ${gold.className} text-base sm:text-lg md:text-xl lg:text-2xl ${app ? "text-white" : "text-[#bedaff]"}`}>
      D.A.A.O
    </Typography>
  </div >
);

export default Logo;
