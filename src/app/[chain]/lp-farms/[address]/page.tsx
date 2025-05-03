'use client';
import LPFarms from '@/components/lpFarms';
import { chainSlugToChainIdMap } from '@/constants/chains';
import { useParams, useRouter } from 'next/navigation';

const LPFarmPage = () => {
  const { address, chain } = useParams();
  const router = useRouter();
  const chainId = chainSlugToChainIdMap[chain as string];
  return (
    <div className="flex justify-center items-center w-full h-full bg-[#0d0d0d]">
      <LPFarms
        lpFarmAddress={address as string}
        chainId={chainId}
        onClose={() => {
          router.push(`/${chain}/farms`);
        }}
      />
    </div>
  );
};

export default LPFarmPage;
