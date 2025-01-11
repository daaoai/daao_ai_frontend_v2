import { PageLayout } from '@/components/page-layout';
import React from 'react';
import { workSans } from '..';
import UpcomingFunds from '@/components/dashboard/upcoming-card';
import BurnCard from '@/components/dashboard/burncard';
import { FUND_CARD_PLACEHOLDER_IMAGE } from '@/lib/links';

const Upcoming: React.FC = () => {

  const props: UpcomingFundDetailsProps = {
    shortname: "3BC",
    twitter: "username",
    telegram: "telegram",
    website: "https://example.com",
    description: "Lorem ipsum odor amet, consectetuer adipiscing elit. Sit eu primis ipsum ante malesuada. Conubia laoreet id vivamus ultrices fringilla suspendisse.",
    fundingProgress: 80,
    logo: FUND_CARD_PLACEHOLDER_IMAGE
  };

  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>
        <div className="grid md:grid-cols-[55%_45%] gap-6 lg:gap-8">
          <UpcomingFunds
            {...props}
          />
          <BurnCard />
        </div>

      </div>
    </PageLayout >
  );
};

export default Upcoming;
