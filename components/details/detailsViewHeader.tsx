import { useRecoilValue } from 'recoil';
import { DART_VIEWER_LINK } from '../../controllers/apiURLs';
import { getDateString } from '../../controllers/chart';
import { StateCurrentTab } from '../../controllers/data/states';
import { useGetPrices } from '../../controllers/net/price';
import { getNumString } from '../../controllers/number';
import styles from './details.module.scss';

const View = (props: { reportCode?: string }) => {
  const { reportCode } = props;
  const { company } = useRecoilValue(StateCurrentTab);
  const dailyReq: TypePriceRequest = { code: company.srtnCd, type: 'daily' };
  const prices = useGetPrices(dailyReq);
  const latestPrice = prices.data?.[prices.data.length - 1];

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <h2 className={styles.headerName}>{company.itmsNm}</h2>
        <a
          href={DART_VIEWER_LINK + reportCode}
          className={styles.toDart}
          target="_blank"
          rel="noreferrer noopener"
        >
          <i className="fa-solid fa-up-right-from-square"></i>
        </a>
      </div>
      <div className={styles.headerItemsWrapper}>
        <div className={styles.headerItem}>
          <h5>Date :</h5>
          <span>{latestPrice && getDateString(latestPrice)}</span>
        </div>
        <div className={styles.headerItem}>
          <h5>Closed At :</h5>
          <span>{getNumString(latestPrice?.close)}</span>
        </div>
        <div className={styles.headerItem}>
          <h5>Stock Counts :</h5>
          <span>{getNumString(latestPrice?.base_stock_cnt)}</span>
        </div>
      </div>
    </header>
  );
};

export default View;
