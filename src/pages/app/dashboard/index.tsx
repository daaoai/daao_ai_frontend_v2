import { PageLayout } from '@/components/page-layout';
import React from 'react';
import { workSans } from '@/lib/fonts';
import { DashboardTable } from '@/components/table/dashboard-table';
import { DashboardColumns } from '@/components/table/dashboard-columns';

const getDashboardData = () => {
  const data: dashboardData[] = Array(25).fill(null).map(() => ({
    address: "0x3f8ejfklsow99303mdksmcm6525",
  }));
  return data;
};

const Dashboard: React.FC = () => {
  const data = getDashboardData()

  return (
    <PageLayout title="App" description="main-app" app={true}>
      <div className="relative min-h-screen w-screen overflow-hidden">

        <div className={`${workSans.className} relative flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12 md:space-y-24`}>
          <div className="container mx-auto">
            <DashboardTable columns={DashboardColumns} data={data} />
          </div>
        </div>

      </div>
    </PageLayout >
  );
};

export default Dashboard;
