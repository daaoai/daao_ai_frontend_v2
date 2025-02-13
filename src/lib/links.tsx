export const WHITEPAPER_URL = "https://docsend.com/view/z9eqsrurcmdky2dn"

export const FUND_CARD_PLACEHOLDER_IMAGE: string = "/images/new-upcoming-img.jpeg"
export const CURRENT_DAO_LINK = "https://www.defaicartel.xyz/"
export const CURRENT_DAO_IMAGE = "/images/new-defai-cartel.jpeg"


import {
  // GitHubIcon,
  XIcon,
  TelegramIcon,
  // DexScreener,
  // DiscordIcon,
} from "@/assets/icons/social";
import { FooterData } from "@/components/footer";
import { Link } from "lucide-react";

export const socialLinks: FooterData[] = [
  {
    label: "Telegram",
    href: "https://t.me/daaoai",
    children: <TelegramIcon />,
  },
  {
    label: "Twitter/X",
    href: "https://x.com/daaoai",
    children: <XIcon />,
  },
];

export const RNDLinks: FooterData[] = [
  {
    label: "Telegram",
    href: "https://t.me/rnddaoai",
    children: <TelegramIcon />,
  },
  {
    label: "Twitter/X",
    href: "https://x.com/RNDdaoai",
    children: <XIcon />,
  },
]

export const DefaiCartelLinks: FooterData[] = [
  {
    label: "Website",
    href: "https://www.defaicartel.xyz/",
    children: <Link />,
  },
  {
    label: "Telegram",
    href: "https://t.me/defaicartel",
    children: <TelegramIcon />,
  },
  {
    label: "Twitter/X",
    href: "https://x.com/DeFAICartel",
    children: <XIcon />,
  },
  // {
  //   label: "DexScreener",
  //   href: "https://x.com/DeFAICartel",
  //   children: <DexScreener />,
  // },
]
