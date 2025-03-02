import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';
import { NextPage } from 'next';
import { Typography } from '@/components/typography';
import { Button } from "@/shadcn/components/ui/button";

// TODO: Fix 404 page causing entire layout to re-render

const Custom404: NextPage = () => {
  return (
    <PageLayout title="Page Not Found" description="This page could not be found" justify="center">
      <div className="flex flex-col justify-center items-center gap-8 text-center">
        <Typography variant="h1">404 - Page Not Found</Typography>
        <Typography variant="paragraph">
          Oops! The page you are looking for does not exist or has been moved.
        </Typography>
        <Link href="/" passHref>
          <Button className="gap-2">Go Back to Homepage</Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default Custom404;
