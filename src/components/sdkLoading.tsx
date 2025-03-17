'use client';
import { useDaaoSdkContext } from '@/sdkContext';

export function SdkLoadingGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useDaaoSdkContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          <h2 className="text-xl font-bold">Error Initializing Application</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
