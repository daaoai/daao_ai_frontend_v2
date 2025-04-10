'use client';

import { chainIdToChainSlugMap, supportedChainIds } from '@/constants/chains';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { chainId: accountChainId } = useAccount();
  const prevChainIdRef = useRef<number | undefined>(undefined);

  // initial routing for home route redirect to funds
  useEffect(() => {
    const prevChainIdEndpoint = prevChainIdRef.current
      ? `/${chainIdToChainSlugMap[prevChainIdRef.current]}/`
      : undefined;
    if (pathname === '/' || (prevChainIdRef.current && pathname === prevChainIdEndpoint)) {
      const chainId =
        accountChainId && Object.values(supportedChainIds).includes(accountChainId)
          ? accountChainId
          : supportedChainIds.mode;
      const chainSlug = chainIdToChainSlugMap[chainId];
      router.push(`/${chainSlug}`);
    }
    prevChainIdRef.current = accountChainId;
  }, [pathname, accountChainId]);

  return <>{children}</>;
};

export default AppLayout;
