import Link from 'next/link';
import React from 'react';
import { ConnectWalletButton } from '../connect-button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    // { name: 'Dashboard', href: '/dapp/dashboard/1' },
    { name: 'WhitePaper', href: 'https://docsend.com/view/z9eqsrurcmdky2dn' },
    { name: 'Farms', href: '/dapp/farms' },
    { name: 'Launch DAO', href: 'https://t.me/arcanelabs', external: true },
  ];

  return (
    <div className="fixed z-50 flex w-full justify-between items-center px-6 py-4 bg-black">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-start" prefetch shallow>
        <Image src="/assets/daao-logo.svg" alt="logo" width={150} height={150} />
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-12">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href);

          return link.external ? (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium text-sm font-sora"
            >
              {link.name}
            </a>
          ) : (
            <Link
              key={link.name}
              href={link.href}
              className={`relative font-medium hidden md:block font-sora text-sm transition-all ${
                isActive ? 'text-teal-50' : 'text-white'
              }`}
              prefetch
              shallow
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 h-[2px] bg-teal-50 w-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          );
        })}

        {/* Connect Wallet Button */}
        <ConnectWalletButton icons={true} />
      </div>
    </div>
  );
};

export default Navbar;
