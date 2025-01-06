import React from "react"
import { Button } from "./ui/button"

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
    <div className="fixed h-screen inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full  max-w-sm rounded-md bg-white p-6 shadow-lg dark:bg-neutral-800">
        <h2 className="mb-4 text-xl font-semibold dark:text-white">
          Join the Waitlist
        </h2>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-md border p-2 focus:outline-none dark:bg-neutral-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleJoinWaitlist}>Join</Button>
        </div>
      </div>
    </div>
  )
}

export default WaitlistModal;
