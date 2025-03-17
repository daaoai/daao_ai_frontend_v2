import '../globals.css';
import ProviderWrapper from '@/wagmi/ProviderWrapper';
import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { DaaoSdkProvider } from '@/sdkContext';
import { SdkLoadingGuard } from '@/components/sdkLoading';

export const metadata = {
  title: 'Daao App',
  description: 'Daao App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body suppressHydrationWarning>
        <ProviderWrapper>
          <DaaoSdkProvider>
            <SdkLoadingGuard>{children}</SdkLoadingGuard>
          </DaaoSdkProvider>
        </ProviderWrapper>
      </body>
    </html>
  );
}
