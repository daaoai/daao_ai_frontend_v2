import { PageLayout } from '@/components/page-layout';
import React from 'react';
import { workSans } from '..';
import FundDetails, { Props } from '@/components/dashboard/fundcard-details';
import Buysell from '@/components/dashboard/buysell-card';

const Dashboard: React.FC<Props> = () => {

  const props: Props = {
    icon: "https://via.placeholder.com/70x70", // Placeholder image URL
    shortname: "ALCH",
    longname: "Alchemist Accelerate",
    description: "A cutting-edge platform focused on accelerating innovation in decentralized finance and blockchain technologies.",
    holdings: 0, // Initial holdings of ALCH
  };

  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className={`gap-20 ${workSans.className} flex flex-col justify-center items-center py-16 px-2 lg:px-44`}>

        <div
          className="grid gap-2 md:gap-3 lg:grid-cols-[60%_40%] lg:items-stretch"
        >
          <div className="p-4 flex items-center justify-center">
            <FundDetails {...props} />
          </div>
          <div className="p-4 flex items-center justify-center">
            <Buysell />
          </div>
        </div>

      </div>
    </PageLayout >
  );
};

export default Dashboard;
