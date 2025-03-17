import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useDaaoSdkContext } from '@/sdkContext';

export function useDaaoSdk() {
  const { sdk, isLoading, error } = useDaaoSdkContext();
  const { chain } = useAccount();

  const chainService = useMemo(() => {
    if (!sdk || !chain?.id) return null;
    try {
      return sdk.getChainService(chain.id);
    } catch (err) {
      console.error('Chain not supported:', err);
      return null;
    }
  }, [sdk, chain?.id]);

  return {
    sdk,
    chainService,
    isLoading,
    error,
  };
}
