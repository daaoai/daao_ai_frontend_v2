import { PageLayout } from '@/components/page-layout';
import React from 'react';

const AppHome: React.FC = () => {
  return (
    <PageLayout title="App" description="main-app" app={true}>
      <p> app.daao.ai </p>
    </PageLayout>
  );
};

export default AppHome;
