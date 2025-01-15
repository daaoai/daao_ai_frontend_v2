import React from "react";

const FundCard: React.FC<FundCardProps> = (props) => (
  <div className="w-full max-w-xs pb-6 bg-[#1a1a1a] flex-col justify-start items-start gap-6 inline-flex">
    <div className="bg-white justify-center items-center inline-flex overflow-hidden w-full">
      <img className="w-full h-auto object-cover" src={props.imgSrc} alt={props.title} />
    </div>
    <div className="self-stretch h-auto px-4 flex-col justify-start items-start gap-4 flex">
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="text-white text-lg md:text-xl font-semibold">{props.title}</div>
        <div className="text-[#939192] text-base md:text-lg font-normal">#{props.buzz} buzz</div>
      </div>
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="text-center text-white text-lg md:text-xl font-bold">${props.token}</div>
        {props.isLive && (
          <div className="px-2 py-1 bg-[#39db83] rounded-sm justify-center items-center gap-2 flex">
            <div className="text-center text-black text-xs md:text-sm font-semibold">Live</div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default FundCard;
