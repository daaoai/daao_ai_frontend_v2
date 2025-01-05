import Image from "next/image";
import React from "react";
import logo from '@/assets/images/logo.svg';
import { Typography } from "./ui/typography";
import { gold } from "@/pages";

interface Props {
  width: number,
  height: number
}

const Logo: React.FC<Props> = ({ width, height }: Props) => (
  <div className="flex items-center space-x-2">
    <Image
      src={logo}
      alt="D.A.A.O Logo"
      width={width}
      height={height}
      priority
    />
    <Typography variant="h3" className={`font-bold ${gold.className}`}>
      D.A.A.O
    </Typography>
  </div>
);

export default Logo;
