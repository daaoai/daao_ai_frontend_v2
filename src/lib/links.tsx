import {
  // GitHubIcon,
  TelegramIcon,
  // DiscordIcon,
  XIcon,
} from "@/assets/icons/social";
import { FooterData } from "@/components/footer";

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

export const WHITEPAPER_URL = "https://docsend.com/view/z9eqsrurcmdky2dn"
