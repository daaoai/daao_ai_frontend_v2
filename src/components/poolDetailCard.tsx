const PoolDetailCard = () => {
  return (
    <div className="flex justify-center space-x-8 bg-black text-white p-6 shadow-md w-full">
      <div className="flex flex-col gap-2 border-t border-gray-20 pt-2 items-start justify-start">
        <p className="text-lightYellow font-rubik text-base font-normal">MARKETCAP</p>
        <p className="text-2xl text-white font-normal">$1,000,000</p>
      </div>
      <div className="flex flex-col gap-2 border-t border-gray-20 pt-2 shadow-md items-start justify-start">
        <p className="text-lightYellow font-rubik text-base font-normal">LIQUIDITY</p>
        <p className="text-2xl text-white font-normal">$1,000,000</p>
      </div>
      <div className="flex flex-col gap-2 border-t border-gray-20 pt-2 shadow-md items-start justify-start">
        <p className="text-lightYellow font-rubik text-base font-normal">PARTICIPANTS</p>
        <p className="text-2xl text-white font-normal">100B</p>
      </div>
    </div>
  );
};

export default PoolDetailCard;
