export const WHITEPAPER_URL = "https://docsend.com/view/z9eqsrurcmdky2dn"
export const FUND_CARD_PLACEHOLDER_IMAGE: string = "/images/upcoming-fund.png"
export const CURRENT_DAO_LINK = "https://app.deform.cc/form/58ec6db5-98e0-45a1-b9f4-de018af4a6fa"
export const CURRENT_DAO_IMAGE = "/images/defai-cartel.png"

import {
  // GitHubIcon,
  XIcon,
  TelegramIcon,
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
]
