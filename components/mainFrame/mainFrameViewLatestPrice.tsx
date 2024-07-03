import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './mainFrame.module.scss';

const getDatetimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `at ${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

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
