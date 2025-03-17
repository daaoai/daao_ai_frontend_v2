'use client';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { DaaoSdk } from '@/daao-sdk/src/DaaoSdk';
import { ChainConfig } from '@/daao-sdk/src/types/chain';
import { setSupportedChainsData } from './store/reducers/chain';
import { useDispatch } from 'react-redux';

interface DaaoSdkContextType {
  sdk: DaaoSdk | null;
  isLoading: boolean;
  error: Error | null;
}

const DaaoSdkContext = createContext<DaaoSdkContextType | null>(null);

export function DaaoSdkProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [sdk, setSdk] = useState<DaaoSdk | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializeSdk() {
      try {
        const response = await fetch('/api/supported-chains');
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch supported chains');
        }

        const supportedChains: ChainConfig[] = result.data;
        const newSdk = new DaaoSdk(supportedChains);
        dispatch(setSupportedChainsData(supportedChains));
        setSdk(newSdk);
      } catch (err) {
        console.error('Failed to initialize SDK:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize SDK'));
      } finally {
        setIsLoading(false);
      }
    }

    initializeSdk();
  }, []);

  return <DaaoSdkContext.Provider value={{ sdk, isLoading, error }}>{children}</DaaoSdkContext.Provider>;
}

export function useDaaoSdkContext() {
  const context = useContext(DaaoSdkContext);
  if (!context) {
    throw new Error('useDaaoSdkContext must be used within a DaaoSdkProvider');
  }
  return context;
}
