import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { useLoadCompanyTabs } from '../../controllers/data/hooks';
import { StateCurrentTab, StateDetailsOpened } from '../../controllers/data/states';
import logoSrc from '../../public/assets/images/junekim_192x192.png';
import Chart from '../charts';
import Details from '../details';
import Search from '../search';
import styles from './mainFrame.module.scss';
import Header from './mainFrameViewHeader';
import Menu from './mainFrameViewMenu';
import Navbar from './mainFrameViewNavbar';

const Presenter = () => {
  useLoadCompanyTabs();
  const currentTab = useRecoilValue(StateCurrentTab);
  const detailsOpened = useRecoilValue(StateDetailsOpened);
  const year = new Date().getFullYear();

  return (
    <main role="main" className={styles.main}>
      <Navbar />
      <Menu />
      <div className={styles.mainFrame}>
        {currentTab.uuid ? (
          <>
            <Header />
            <Chart />
            {detailsOpened && <Details />}
          </>
        ) : (
          <Search />
        )}
        <footer className={styles.footer}>
          <div>Copyright &copy; {year === 2024 ? year : `2024-${year}`}</div>
          <div className={styles.author}>
            June Kim
            <Image src={logoSrc} alt="logo" width={24} height={24} />
          </div>
          <div>All rights are reserved.</div>
        </footer>
      </div>
    </main>
  );
};

export default Presenter;
