import { useRecoilValue } from 'recoil';
import { getDateString } from '../../controllers/chart';
import { useToggleDetails } from '../../controllers/data/hooks';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import MiniPrice from '../miniPrice';
import styles from './mainFrame.module.scss';
import { useSwitchTypeBtnClick } from './mainFrameInteractor';

const View = () => {
  const { company, mainType } = useRecoilValue(StateCurrentTab);
  const dailyReq: TypePriceRequest = { code: company.srtnCd, type: 'daily' };
  const weeklyReq: TypePriceRequest = { code: company.srtnCd, type: 'weekly' };
  const prices = useGetPrices(dailyReq);
  const latestData = prices.data?.[prices.data.length - 1];

  const onSwitchTypeBtnClick = useSwitchTypeBtnClick();
  const onToggleDetails = useToggleDetails();

  return (
    <header className={styles.header}>
      <div className={styles.companyInfo}>
        <h1>{company.itmsNm}</h1>
        <h3>{company.srtnCd}</h3>
        <h3>{company.mrktCtg}</h3>
        <h3>{mainType}</h3>
        <h5>
          {latestData && getDateString(latestData)}
          <br />
          closed at {latestData?.close.toLocaleString()} KRW
        </h5>
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
