import React, { useState } from "react"
import { ArrowRight, X } from "lucide-react";
import { TelegramIcon } from "@/assets/icons/social";
import Link from "next/link";
import { socialLinks } from "@/lib/links";

interface waitlistmodalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  publicKey: string;
  setPublicKey: (key: string) => void;
}

const WaitlistModal: React.FC<waitlistmodalProps> = ({
  isOpen,
  setIsOpen,
  publicKey,
  setPublicKey,
}) => {
  const [statusMsg, setStatusMsg] = useState("");

  const isValidPublicKey = (value: string) => {
    // Basic validation for a public key. Adjust as per the format.
    return value.length > 0; // Example: Non-empty string
  };

  // Function to handle the API call
  const handleJoinWaitlist = async () => {
    if (!publicKey.trim()) {
      setStatusMsg("Please enter your public key");
      return;
    }

    // Check if public key is valid
    if (!isValidPublicKey(publicKey)) {
      setStatusMsg("Please enter a valid public key");
      return;
    }
    try {
      const response = await fetch("/api/auth/joinWaitList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicKey }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Error: ", err.error);
        setStatusMsg("Failed to join waitlist");
        return;
      }

      // Clear the input
      setPublicKey("");
      setStatusMsg("You have been added to the waitlist!");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      setStatusMsg("Something went wrong, please try again later");
    }}

    if (!isOpen) return null;

    return (
      <div className="fixed h-screen inset-0 z-[9999] flex items-center justify-center px-4">
        <div className="sm:w-[600px] w-[400px] min-h-min px-6 pb-16 pt-4 rounded-xl bg-[#010d1f] border border-[#aeb3b6] flex-col justify-center items-center gap-9 inline-flex">
          <div className="flex justify-end w-full m-0">
            <button
              onClick={() => {
                setIsOpen(false)
                setStatusMsg("")
                setPublicKey("")
              }}
              aria-label="Close"
              className="w-6 h-6 flex justify-center items-center text-[#9e9e9e] hover:text-white bg-transparent rounded-full"
            >
              <X />
            </button>
          </div>
          <div className="h-min flex-col justify-center items-center gap-2.5 flex">
            <div className="text-center text-white text-2xl font-normal">
              Launch a DAAO
            </div>
            <div className="text-center text-white text-sm font-normal">
              Stay in the loop with our latest progress and features.
            </div>
            <div className={`flex flex-col gap-4 text-center ${statusMsg.includes("added") ? "text-green-700" : "text-red-700"} text-xl font-normal`}>
              {statusMsg}
              {statusMsg.includes("added") ? (
                <div className="gap-1 text-base flex flex-col text-neutral-400 justify-center items-center h-min">
                  <p>Feel free to join our telegram!</p>
                  <Link
                    href={socialLinks.find((link) => link.label === "Telegram")?.href || "https://t.me/rndaoai"}
                    className="flex flex-row gap-2 justify-center items-center text-blue-400"
                  >
                    <TelegramIcon />
                    <span>Daao.ai</span>
                  </Link>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-12 px-5 py-3.5 bg-[#212121] rounded-l-full flex items-center">
              <input
                type="email"
                placeholder="Email"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="bg-transparent text-[#9e9e9e] text-base font-normal leading-tight outline-none w-full placeholder:text-[#9e9e9e]"
              />
            </div>
            <button
              onClick={handleJoinWaitlist}
              className="flex items-center px-4 sm:py-2 py-1 bg-white rounded-full ml-[-20px] shadow-md"
            >
              <div className="w-8 h-8 flex justify-center items-center bg-white rounded-full border border-black">
                <ArrowRight className="w-4 h-4 text-black" />
              </div>
              <span className="text-black text-base font-medium leading-tight ml-2">
                Register for whitelist
              </span>
            </button>
          </div>
        </div>
      </div >
    )
  }

  export default WaitlistModal;
