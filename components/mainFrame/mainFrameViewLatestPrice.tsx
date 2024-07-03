import { TypePriceRequest } from '../../controllers/data/types';
import { getDatetimeString } from '../../controllers/datetime';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './mainFrame.module.scss';

const View = (props: { code: string }) => {
  const { code } = props;
  const latestReq: TypePriceRequest = { code, type: 'latest' };
  const { data } = useGetPricesLatest(latestReq);

  return (
    <h5>
      <div className={styles.latestPriceWrapper}>
        latest price:
        {data?.prices.length ? (
          <>
            <span className={styles.latestPrice}>{data.prices[0].close.toLocaleString()}</span>
            KRW
          </>
        ) : (
          <div className={styles.spinner}></div>
        )}
      </div>
      <div>{data?.current_datetime ? getDatetimeString(data?.current_datetime) : ''}</div>
    </h5>
  );
};

export default View;
