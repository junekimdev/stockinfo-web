import { useRecoilValue } from 'recoil';
import { DIFF_NATION_URL } from '../../controllers/apiURLs';
import { StateCompanyTabs } from '../../controllers/data/states';
import styles from './mainFrame.module.scss';
import { useAddNewTabClick, useMoveToHome, useToggleMenu } from './mainFrameInteractor';
import { MainFrameStateMenuOpened } from './mainFrameStates';
import Tab from './mainFrameViewTab';

const View = () => {
  const tabs = useRecoilValue(StateCompanyTabs);
  const menuOpened = useRecoilValue(MainFrameStateMenuOpened);

  const onToggleMenu = useToggleMenu();
  const moveToHome = useMoveToHome();
  const onAddNewTabClick = useAddNewTabClick();

  return (
    <nav className={styles.navbarVertical}>
      <div className={styles.brandWrapper}>
        <h1 onClick={moveToHome}>
          JK Stock
          <br />
          KR
        </h1>
      </div>
      <div className={styles.changeNation}>
        <a href={DIFF_NATION_URL}>Go to US Stock</a>
      </div>
      <ul className={styles.tabList}>
        <li className={styles.addNewTab} onClick={onAddNewTabClick}>
          +
        </li>
        {tabs.map((tab) => (
          <Tab key={tab.uuid} tab={tab} />
        ))}
      </ul>
      <div className={styles.menuToggleBtn} onClick={onToggleMenu}>
        <div className={menuOpened ? styles.menuCloseBtn : styles.menuOpenBtn}></div>
      </div>
    </nav>
  );
};

export default View;
