import Link from 'next/link';
import React from 'react';
import { ConnectWalletButton } from '../connect-button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();
  const isDapp = pathname.includes('dapp');
  const navContent = {
    home: { href: '/', logo: '/assets/daao-logo.svg' },
    dashboard: { href: '/dapp/dashboard/1', text: 'Dashboard' },
    farms: { href: '/dapp/farms', text: 'Farms' },
    launchDao: { href: 'https:t.me/arcanelabs', text: 'Launch DAO' },
  };

  return (
    <div className="fixed z-50 flex w-full justify-between items-center px-6 py-4 bg-black">
      <Link href={navContent.home.href} className="flex items-center justify-start" prefetch shallow>
        <Image src={navContent.home.logo} alt="logo" width={150} height={150} />
      </Link>
      <div className="flex items-center gap-12">
        <Link
          href={navContent.dashboard.href}
          className="font-medium hidden md:block font-sora text-sm"
          prefetch
          shallow
        >
          {navContent.dashboard.text}
        </Link>
        <Link
          href={navContent.farms.href}
          className="text-white font-medium hidden md:block font-sora text-sm"
          prefetch
          shallow
        >
          {navContent.farms.text}
        </Link>
        <Link
          href={navContent.launchDao.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-medium text-sm font-sora"
        >
          {navContent.launchDao.text}
        </Link>
        <ConnectWalletButton icons={true} />
      </div>
    </div>
  );
};

export default Navbar;
