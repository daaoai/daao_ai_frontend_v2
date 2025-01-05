import {
  GitHubIcon,
  TelegramIcon,
  DiscordIcon,
  XIcon,
} from "@/assets/icons/social";
import { FooterData } from "@/components/footer";

const socialLinks: FooterData[] = [
  {
    label: "GitHub",
    href: "https://github.com/your-profile",
    children: <GitHubIcon />,
  },
  {
    label: "Telegram",
    href: "https://t.me/your-telegram",
    children: <TelegramIcon />,
  },
  {
    label: "Discord",
    href: "https://discord.com/invite/your-invite",
    children: <DiscordIcon />,
  },
  {
    label: "Twitter/X",
    href: "https://twitter.com/your-profile",
    children: <XIcon />,
  },
];

export default socialLinks;

