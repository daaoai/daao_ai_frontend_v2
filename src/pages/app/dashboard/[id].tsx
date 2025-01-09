import { PageLayout } from '@/components/page-layout';
import React from 'react';
import { workSans } from '..';
import FundDetails from '@/components/dashboard/fundcard-details';

type Props = {
  icon: string; // icon image url
  shortname: string; // eg $ALCH
  longname: string; // eg Alchemist Accelerate
  description: string;
  holdings: number; // 0 ALCH
}


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

        <FundDetails
          {...props}
        />

      </div>
    </PageLayout >
  );
};

export default Dashboard;
