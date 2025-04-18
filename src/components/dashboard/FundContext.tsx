'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useFetchBalance } from '../../hooks/useFetchBalance';
import { useAccount } from 'wagmi';
import React from 'react';

interface FundContextType {
  fetchedData: any;
  refreshData: () => Promise<void>;
  totalContributed: number;
  updateTotalContributed: (amount: number) => void;
  daoBalance: string;
  setDaoBalance: React.Dispatch<React.SetStateAction<string>>;
  priceUsd: number;
  setPriceUsd: React.Dispatch<React.SetStateAction<number>>;
}

const FundContext = createContext<FundContextType | undefined>(undefined);

export const FundProvider = ({ children }: { children: ReactNode }) => {
  const account = useAccount();
  const accountAddress = account.address as `0x${string}`;
  const { data: fetchedData, refreshData } = useFetchBalance(accountAddress);

  const totalraised = fetchedData.totalRaised;

  const [priceUsd, setPriceUsd] = useState(0);
  const [totalContributed, setTotalContributed] = useState(Number(totalraised));
  const updateTotalContributed = (amount: number) => {
    setTotalContributed((prev) => prev + amount);
    refreshData();
  };
  const [daoBalance, setDaoBalance] = useState('0');
  return (
    <FundContext.Provider
      value={{
        fetchedData,
        refreshData,
        totalContributed,
        updateTotalContributed,
        daoBalance,
        setDaoBalance,
        priceUsd,
        setPriceUsd,
      }}
    >
      {children}
    </FundContext.Provider>
  );
};

export const useFundContext = () => {
  const context = useContext(FundContext);
  if (!context) {
    throw new Error('useFundContext must be used within a FundProvider');
  }
  return context;
};
