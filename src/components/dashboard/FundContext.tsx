import { createContext, useContext, useState, ReactNode } from "react";
import { useFetchBalance } from "./fetchBalance";
import { useAccount } from "wagmi";

interface FundContextType {
  fetchedData: any;
  refreshData: () => Promise<void>;
  totalContributed: number;
  updateTotalContributed: (amount: number) => void;

}

const FundContext = createContext<FundContextType | undefined>(undefined);

export const FundProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount();
  const accountAddress = account.address as `0x${string}`;
  const { data: fetchedData, refreshData } = useFetchBalance(accountAddress);

  const totalraised = fetchedData.totalRaised;
 

  const [totalContributed, setTotalContributed] = useState(Number(totalraised));
  const updateTotalContributed = (amount: number) => {
    setTotalContributed((prev) => prev + amount);
    refreshData(); 
  };
  return (
    <FundContext.Provider value={{ fetchedData, refreshData,totalContributed, updateTotalContributed }}>
      {children}
    </FundContext.Provider>
  );
};

export const useFundContext = () => {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error("useFundContext must be used within a FundProvider");
  }
  return context;
};
