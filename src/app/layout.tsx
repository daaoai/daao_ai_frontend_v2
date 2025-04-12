import ProviderWrapper from '@/wagmi/ProviderWrapper';
import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css';
import AppLayout from './AppLayout';
export const metadata = {
  title: 'Daao App',
  description: 'Daao App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body>
        <ToastContainer />
        <ProviderWrapper>
          <AppLayout>{children}</AppLayout>
        </ProviderWrapper>
      </body>
    </html>
  );
}
