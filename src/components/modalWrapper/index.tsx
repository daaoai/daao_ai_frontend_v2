'use client';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const ModalWrapper: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClickOutside, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center py-4 pt-32 px-6 z-10 bg-opacity-70 backdrop-blur-md">
      <div ref={modalRef} className={clsx('relative shadow-lg w-full max-w-lg rounded-lg flex justify-center items-center', className)}>
        {children}
      </div>
    </div>
  );
};

export { ModalWrapper };





// 'use client';
// import React, { useState } from 'react';
// import { Button } from '@/src/shadcn/components/ui/button';
// import { Settings } from 'lucide-react';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/shadcn/components/ui/tooltip';
// import Text from '../../common/text';
// import SettingsModal from '../SettingsModal';
// import { ModalWrapper } from '../../modalWrapper';
// import { ZapExchangeHeader } from '@/src/content/zapping/zapExchange';
// import AutoRefresher from '../../routesSection/AutoRefresher';
// import type { PathApiResponseType } from '@/src/types/zapping/path';
// import { NumberConstants } from '@/src/constants/general/numbers';

// interface HeaderProps {
//   title: string;
//   routeIsLoading: boolean;
//   isValid: boolean;
//   getPath: () => Promise<PathApiResponseType | null | undefined>;
// }

// const Header: React.FC<HeaderProps> = ({ title, routeIsLoading, getPath, isValid }) => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <>
//       <div className="flex justify-between items-center mb-4">
//         <Text type="p" className="text-xl font-medium text-foreground-50 font-handjet">
//           {title}
//         </Text>
//         <div className="flex gap-2">
//           {isValid && (
//             <AutoRefresher
//               refreshQuotes={async () => {
//                 await getPath();
//               }}
//               isLoading={routeIsLoading}
//               disableQuotesRefresh={false}
//               showIcon={true}
//               timeInterval={NumberConstants.SIXTY}
//               bgColor="bg-blue-800"
//               iconColor="text-neon-800"
//             />
//           )}
//           <TooltipProvider delayDuration={NumberConstants.HUNDRED}>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={openModal}>
//                   <Settings width="20" height="20" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent className="text-white bg-gray-80 p-2">{ZapExchangeHeader.settings}</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <ModalWrapper isOpen={isModalOpen} onClose={closeModal}>
//           <SettingsModal onClose={closeModal} />
//         </ModalWrapper>
//       </div>
//     </>
//   );
// };

// export default Header;