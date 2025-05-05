'use client';
import LPFarms from '@/components/lpFarms';
import { chainSlugToChainIdMap } from '@/constants/chains';
import { useParams, useRouter } from 'next/navigation';

const LPFarmPage = () => {
  const { address, chain } = useParams();
  const router = useRouter();
  const chainId = chainSlugToChainIdMap[chain as string];
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2F2F2F] h-12 bg-black">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-white active:scale-95 transition-transform ease-in-out duration-150"
        >
          &larr; Back to Farms
        </button>
      </div>
      <div className="flex items-center justify-center p-4 bg-black">
        <div className="flex justify-center items-center w-full max-w-lg h-full bg-[#0d0d0d]">
          <LPFarms
            lpFarmAddress={address as string}
            chainId={chainId}
            onClose={() => {
              router.push(`/${chain}/farms`);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default LPFarmPage;
