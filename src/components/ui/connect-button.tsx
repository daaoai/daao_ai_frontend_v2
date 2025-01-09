"use client";

// Import necessary components and hooks from libraries
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./button"; // Custom Button component
import { modeTestnet, goerli, sepolia } from "wagmi/chains"; // Import networks
import Image from "next/image"; // Import Image component for displaying chain icons
import { workSans } from "@/pages/app";
import { Text, Wallet } from "lucide-react";

// Array containing Ethereum chain IDs (mainnet, goerli, sepolia)
const ethChainIds: number[] = [modeTestnet.id, goerli.id, sepolia.id];

// Main ConnectWalletButton component
export const ConnectWalletButton = () => {
  return (
    // Using ConnectButton.Custom for a customized connection button
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Check if the component is mounted and authentication is not loading
        const ready = mounted && authenticationStatus !== "loading";

        // Check if the user is connected and authenticated
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        // Check if the selected chain is an Ethereum network
        const isEthChain = chain && ethChainIds.includes(chain.id);

        return (
          // Hide the content when not ready or during loading
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              // If not connected, show a button to connect the wallet
              if (!connected) {
                return (
                  <div className="flex flex-row justify-center items-center gap-4">
                    <Button
                      onClick={openConnectModal} // Trigger the connect modal
                      type="button"
                      className={`text-sm p-2 bg-[#27292a] rounded-xl flex items-center gap-2 ${workSans.className} font-bold leading-normal hover:bg-[#27292a]/50`}
                    >
                      <Wallet className="w-5 h-5" /> {/* Adjust icon size for better alignment */}
                      Connect Wallet
                    </Button>
                    <Text />
                  </div>
                );
              }

              // If the chain is not Ethereum or unsupported, show a 'Wrong network' button
              if (!isEthChain || chain.unsupported) {
                return (
                  <Button
                    variant={"destructive"} // 'destructive' variant for an error button
                    onClick={openChainModal} // Trigger the chain modal
                    type="button"
                    className="rounded-xl" // Apply rounded corners
                  >
                    Wrong network
                  </Button>
                );
              }

              // If the wallet is connected and the chain is supported, show wallet and chain details
              return (
                <div className="flex gap-2 max-md:flex-col-reverse md:justify-center md:items-center">
                  {/* Show the chain button with its icon and name */}
                  <Button
                    className="rounded-xl"
                    variant={"outline"} // 'outline' variant for the button
                    onClick={openChainModal} // Trigger the chain modal
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      // Display the chain icon if available
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl} // Chain icon URL
                            width={12}
                            height={12}
                          />
                        )}
                      </div>
                    )}
                    {chain.name} {/* Display the chain name */}
                  </Button>

                  {/* Show the account button with balance and display name */}
                  <Button
                    variant={"outline"} // 'outline' variant for the button
                    onClick={openAccountModal} // Trigger the account modal
                    className="bg-gradient rounded-xl font-normal hover:opacity-90 text-gray-100 dark:text-foreground"
                    type="button"
                  >
                    {account.displayName} {/* Display account name */}
                    {account.displayBalance
                      ? ` (${account.displayBalance})` // Display balance if available
                      : ""}
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
