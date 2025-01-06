import React from "react"
import { ArrowRight, X } from "lucide-react";

interface waitlistmodalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
}

const WaitlistModal: React.FC<waitlistmodalProps> = ({
  isOpen,
  setIsOpen,
  email,
  setEmail,
}) => {
  const isValidEmail = (value: string) => {
    // Basic pattern: something@something.something
    // You can strengthen this regex if needed.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };


  // 3. Function to handle the API call
  const handleJoinWaitlist = async () => {
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    // Check if email is valid
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch("/api/auth/joinWaitList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Failed to join waitlist");
        return;
      }

      // Clear the input, close modal, show success
      setEmail("");
      setIsOpen(false);
      alert("Thanks for joining the waitlist!");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed h-screen inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="sm:w-[600px] w-[400px] sm:h-[300px] px-6 pb-16 pt-4 rounded-xl bg-[#010d1f] border border-[#aeb3b6] flex-col justify-center items-center gap-9 inline-flex">
        <div className="flex justify-end w-full m-0">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="w-6 h-6 flex justify-center items-center text-[#9e9e9e] hover:text-white bg-transparent rounded-full"
          >
            <X />
          </button>
        </div>
        <div className="h-14 flex-col justify-center items-center gap-2.5 flex">
          <div className="text-center text-white text-2xl font-normal">
            Launch a DAAO
          </div>
          <div className="text-center text-white text-sm font-normal']">
            Stay in the loop with our latest progress and features.
          </div>
        </div>
        <div className="flex items-center">
          <div className="h-12 px-5 py-3.5 bg-[#212121] rounded-l-full flex items-center">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-[#9e9e9e] text-base font-normal leading-tight outline-none w-full placeholder:text-[#9e9e9e]"
            />
          </div>
          <button
            onClick={handleJoinWaitlist}
            className="flex items-center px-4 sm:py-2 py-1 bg-white rounded-full ml-[-20px] shadow-md"
          >
            <div className="p-2 w-8 h-8 flex justify-center items-center bg-[#212121] rounded-full text-white">
              <ArrowRight className="w-4 h-4 text-[#9e9e9e]" />
            </div>
            <span className="text-black text-base font-medium leading-tight ml-2">
              Join Waitlist
            </span>
          </button>
        </div>
      </div>
    </div >
  )
}

export default WaitlistModal;
