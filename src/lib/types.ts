type FundCardProps = { // main app page card props
  title: string;
  buzz: string;
  token: string;
  isLive: boolean;
  imgSrc: string;
}

type FundDetailsProps = { // fund dashboard info card props
  icon: string;
  shortname: string;
  longname: string;
  description: string;
  holdings: number;
}

type UpcomingFundDetailsProps = {
  shortname: string;
  twitter: string;
  telegram: string;
  website: string;
  description: string;
  fundingProgress: number;
  logo: string;
}

interface InfoRowProps {
  label: string
  value: string
  mode?: boolean
}

interface OrderbookProps {
  name: string
  created: string
  owner: string
  treasury: string
  token: string
  tradingEnds: string
  ethRaised: string
}

