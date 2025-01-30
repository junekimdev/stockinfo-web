import { useAtomValue } from 'jotai';
import { useToggleDetails } from '../../controllers/data/hooks';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import MiniPrice from '../miniPrice';
import styles from './mainFrame.module.scss';
import { useSwitchTypeBtnClick } from './mainFrameInteractor';
import LatestPrice from './mainFrameViewLatestPrice';

const View = () => {
  const { company, mainType } = useAtomValue(StateCurrentTab);
  const dailyReq: TypePriceRequest = { code: company.srtnCd, type: 'daily' };
  const weeklyReq: TypePriceRequest = { code: company.srtnCd, type: 'weekly' };

  const onSwitchTypeBtnClick = useSwitchTypeBtnClick();
  const onToggleDetails = useToggleDetails();

  return (
    <header className={styles.header}>
      <div className={styles.companyInfo}>
        <h1>{company.itmsNm}</h1>
        <div className={styles.companyInfoSub}>
          <h3>{company.mrktCtg}</h3>
          <h3>{company.srtnCd}</h3>
        </div>
        <h3>{mainType}</h3>
        <LatestPrice code={company.srtnCd} />
      </div>
      <div className={styles.miniChartsWrapper}>
        <div className={styles.miniChart}>
          <span>Latest 50 {dailyReq.type} :</span>
          <MiniPrice req={dailyReq} />
        </div>

        <div className={styles.miniChart}>
          <span>Latest 50 {weeklyReq.type} :</span>
          <MiniPrice req={weeklyReq} />
        </div>
      </div>
      <div className={styles.headerBtnWrapper}>
        <button className={styles.headerBtn} onClick={onSwitchTypeBtnClick}>
          Switch to {mainType === 'daily' ? 'weekly' : 'daily'}
        </button>
        <button className={styles.headerBtn} onClick={onToggleDetails}>
          Open Details
        </button>
      </div>
    </header>
  );
};

export default View;
