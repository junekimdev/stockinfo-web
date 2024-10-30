import { useRecoilValue } from 'recoil';
import { DART_VIEWER_LINK } from '../../controllers/apiURLs';
import { getDateString } from '../../controllers/chart';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './details.module.scss';

const View = (props: { reportCode?: string }) => {
  const { reportCode } = props;
  const { company } = useRecoilValue(StateCurrentTab);
  const req: TypePriceRequest = { code: company.srtnCd, type: 'latest' };
  const { data: latestPrice } = useGetPricesLatest(req);

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
          <h5>Latest Price :</h5>
          <span>{latestPrice?.close.toLocaleString()}</span>
        </div>
        <div className={styles.headerItem}>
          <h5>Stock Counts :</h5>
          <span>{latestPrice?.base_stock_cnt.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};

export default View;
