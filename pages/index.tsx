import { useResetAtom } from 'jotai/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import MainFrame from '../components/mainFrame';
import MarketCap from '../components/marketcap';
import Meta from '../components/meta';
import { useCheckCompanyVersion } from '../controllers/data/hooks';
import * as gState from '../controllers/data/states';

const Page = () => {
  const publicUrl = process.env.NEXT_PUBLIC_URL ?? 'localhost:3000';
  const router = useRouter();
  const resetCurrent = useResetAtom(gState.currentTab);

  useCheckCompanyVersion();
  useEffect(() => {
    window.scrollTo(0, 0);
    resetCurrent();
    router.prefetch('/chart');
  }, [resetCurrent, router]);

  return (
    <>
      <Meta title="JK Stock" desc="JK Stock presented by junekimdev" url={publicUrl}></Meta>
      <MainFrame>
        <MarketCap />
      </MainFrame>
    </>
  );
};

export default Page;
