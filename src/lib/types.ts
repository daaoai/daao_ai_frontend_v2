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
  longname: string;
  shortname: string;
  twitterUsername: string;
  twitterLink: string;
  telegramUsername: string;
  telegramLink: string;
  website: string;
  description: string;
  aboutToken: string;
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

interface leaderboardData {
  id: number;
  icon: string;
  name: string;
  creator: string;
  price: number;
  dayVol: number;
  marketCap: number;
}

type dashboardData = {
  address: string,
}
