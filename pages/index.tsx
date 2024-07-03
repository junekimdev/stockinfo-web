import { useRouter } from 'next/router';
import { useEffect } from 'react';
import MainFrame from '../components/mainFrame';
import MarketCap from '../components/marketcap';
import Meta from '../components/meta';

const Page = () => {
  const publicUrl = process.env.NEXT_PUBLIC_URL ?? 'localhost:3000';
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
    router.prefetch('/chart');
  }, [router]);

  return (
    <>
      <Meta
        title="Stockinfo | junekimdev"
        desc="Stockinfo created by junekimdev"
        url={publicUrl}
      ></Meta>
      <MainFrame>
        <MarketCap />
      </MainFrame>
    </>
  );
};

export default Page;
