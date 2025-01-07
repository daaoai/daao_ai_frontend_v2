import { PageLayout } from '@/components/page-layout';
import React from 'react';

import { Work_Sans } from 'next/font/google';
export const workSans = Work_Sans({
  subsets: ["latin"],
  weight: "400",
})

const AppHome: React.FC = () => {
  return (
    <PageLayout title="App" description="main-app" app={true}>
      <p> app.daao.ai </p>
    </PageLayout>
  );
};

export default AppHome;
