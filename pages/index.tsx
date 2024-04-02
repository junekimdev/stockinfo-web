import { useEffect } from 'react';
import Example from '../components/example';
import MainFrame from '../components/mainFrame';
import Meta from '../components/meta';

const Page = () => {
  const publicUrl = process.env.NEXT_PUBLIC_URL ?? 'localhost:3000';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Meta
        title="Template | junekimdev"
        desc="Template created by junekimdev"
        url={publicUrl}
      ></Meta>
      <MainFrame>
        <Example />
      </MainFrame>
    </>
  );
};

export default Page;
