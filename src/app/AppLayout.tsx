'use client';
import { chainIdToChainSlugMap } from '@/config/chains';
import { supportedChainIds } from '@/constants/chains';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { chainId: accountChainId } = useAccount();

  // initial routing for home route redirect to funds
  useEffect(() => {
    if (pathname === '/') {
      const chainId =
        accountChainId && Object.values(supportedChainIds).includes(accountChainId)
          ? accountChainId
          : supportedChainIds.mode;
      const chainSlug = chainIdToChainSlugMap[chainId];
      router.push(`/${chainSlug}`);
    }
  }, [pathname, accountChainId]);

  return <>{children}</>;
};

export default AppLayout;
