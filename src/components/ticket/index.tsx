"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useGetTicketPrice from "@/hooks/useTicket";
import useGetBalance from "@/hooks/useGetBalance";
import { formatUnits } from "viem";
import useBuyTickets from "@/hooks/useBuyTickets";

const MAX_TICKETS = 25;

const TicketPurchase = () => {
  const [tickets, setTickets] = useState(0);
  const [nftId, setNftId] = useState("");
  const [localError, setLocalError] = useState("");

  const { ticketPrice } = useGetTicketPrice();
  const { symbol, decimals, balance } = useGetBalance();
  const { buyTickets, mintedData, isLoading, isSuccess, error } = useBuyTickets();

  // Validate the ticket count locally.
  useEffect(() => {
    if (tickets < 1) {
      setLocalError("Please select at least 1 ticket");
    } else if (tickets > MAX_TICKETS) {
      setLocalError(`You can select a maximum of ${MAX_TICKETS} tickets`);
    } else {
      setLocalError("");
    }
  }, [tickets]);

  // When mintedData becomes available, update the NFT ID.
  useEffect(() => {
    if (mintedData) {
      setNftId(mintedData.tokenId.toString());
    }
  }, [mintedData]);

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    setTickets(value);
  };

  const isButtonDisabled = tickets < 1 || tickets > MAX_TICKETS || isLoading;

  // Calculate pricing details.
  const pricePerTicket = formatUnits((ticketPrice ?? 0) as bigint, decimals ?? 18);
  const totalTicketAmount = tickets * Number(pricePerTicket);

  const handleBuyTickets = async () => {
    await buyTickets({ ticketCount: tickets, ticketPrice: Number(ticketPrice), decimals: decimals ?? 1 });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-16">
      {!isSuccess ? (
        <>
          <CardHeader>
            <CardTitle>Purchase Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tickets">Number of Tickets (Max {MAX_TICKETS})</Label>
                <Input
                  id="tickets"
                  type="number"
                  min="1"
                  max={MAX_TICKETS}
                  value={tickets}
                  onChange={handleTicketChange}
                />
              </div>

              {localError && (
                <Alert variant="destructive">
                  <AlertDescription>{localError}</AlertDescription>
                </Alert>
              )}

              {/* Display error returned from the hook */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <p>
                Price per Ticket: {pricePerTicket} {symbol}
              </p>
              <p className="text-white">
                User Balance: {formatUnits((balance ?? 0) as bigint, decimals ?? 18)} {symbol}
              </p>
              <p className="text-xl font-semibold">
                Total Amount: {totalTicketAmount} {symbol}
              </p>
              <div className="text-lg">Tokens to Burn: {totalTicketAmount}</div>

              {/* Display minted NFT info if available */}
              {mintedData && (
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold">NFT ID: {nftId}</p>
                  <p>Thank you for your purchase!</p>
                  <p>Tickets: {tickets}</p>
                  <p>Tokens Burned: {tickets}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full relative overflow-hidden"
              onClick={handleBuyTickets}
              disabled={isButtonDisabled}
            >
              {isLoading && <div className="absolute inset-0 bg-white/20 shimmer" />}
              {isLoading ? "Processing..." : "Buy Tickets"}
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Purchase Successful!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-2xl font-bold">NFT ID: {nftId}</p>
              <p>Thank you for your purchase!</p>
              <p>Tickets: {tickets}</p>
              <p>Tokens Burned: {tickets}</p>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default TicketPurchase;
