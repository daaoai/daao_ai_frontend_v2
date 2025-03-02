'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';
import { mode, goerli, sepolia } from 'wagmi/chains'; // Import networks
import Image from 'next/image'; // Import Image component for displaying chain icons
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import React from 'react';

// Array containing Ethereum chain IDs (mainnet, goerli, sepolia)
const ethChainIds: number[] = [mode.id, goerli.id, sepolia.id];

interface ConnectWalletButtonProps {
  className?: string;
  icons: boolean;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className, icons = true }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
        const isEthChain = chain && ethChainIds.includes(chain.id);

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div className="flex flex-row justify-center items-center gap-4">
                    <Button
                      onClick={openConnectModal}
                      type="button"
                      className={cn(
                        'text-sm p-2 bg-[#27292a] rounded-xl flex items-center gap-2 font-bold leading-normal hover:bg-[#27292a]/50',
                        className,
                      )}
                    >
                      {icons ? <Wallet className="w-3 h-3" /> : <></>}
                      <span className={`test-white font-semibold`}>Connect Wallet</span>
                    </Button>
                    {/*{icons ? <Text className="w-5 h-5" /> : <></>}*/}
                  </div>
                );
              }

              if (!isEthChain || chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    type="button"
                    className={cn(
                      'text-sm p-2 bg-red-500 text-white rounded-xl flex items-center gap-2 font-bold leading-normal hover:bg-red-600',
                      className,
                    )}
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={openChainModal}
                    type="button"
                    className={cn(
                      'text-sm p-2 bg-[#27292a] rounded-xl flex items-center gap-2 font-bold leading-normal hover:bg-[#27292a]/50',
                      className,
                    )}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} width={20} height={20} />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    type="button"
                    className={cn(
                      'text-sm p-2 bg-[#27292a] rounded-xl flex items-center gap-2 font-bold leading-normal hover:bg-[#27292a]/50',
                      className,
                    )}
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
