'use client';
import { ConnectWalletButton } from '@/components/connect-button';
import { FundSection } from '@/components/dashboard/fundsection';
import FAQDaao from '@/components/faqDaao';
import { PageLayout } from '@/components/page-layout';
import PoolDetailCard from '@/components/poolDetailCard';
import { chainsData } from '@/constants/chains';
import { daoAddress } from '@/constants/addresses';
import { FUND_CARD_PLACEHOLDER_IMAGE } from '@/constants/links';
import { DAAO_CONTRACT_ABI } from '@/daao-sdk/abi/daao';
import { fetchIsFundraisingFinalized } from '@/helpers/contribution';
import { useToast } from '@/hooks/use-toast';
import type { Fund } from '@/types/fund';
import { ethers } from 'ethers';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ProgressBar from '@/components/utils/Progressbar';

const HomePage: NextPage = () => {
  return (
    <div>
      <ProgressBar />
    </div>
  );
};

export default HomePage;
