import '../globals.css';
import ProviderWrapper from '@/wagmi/ProviderWrapper';

export const metadata = {
  title: 'Daao App',
  description: 'Daao App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body suppressHydrationWarning>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
