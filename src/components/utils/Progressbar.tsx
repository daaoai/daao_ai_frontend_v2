import { motion } from 'framer-motion';
import Image from 'next/image';

const ProgressBar = () => {
  const progress = 75;

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-3">
        <Image src="/assets/brand.svg" alt="Logo" width={30} height={30} />
      </div>
      <div className="relative w-96 h-3 bg-gray-300 rounded-full">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2 }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
