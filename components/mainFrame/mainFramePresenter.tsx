import { useRecoilValue } from 'recoil';
import { useLoadCompanyTabs } from '../../controllers/data/hooks';
import { StateCurrentTab, StateDetailsOpened } from '../../controllers/data/states';
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
      </div>
    </main>
  );
};

export default Presenter;
