import { useRecoilValue } from 'recoil';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypeDartStatementItem, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import { shortenNumStringMillion } from '../../controllers/number';
import styles from './details.module.scss';

const getRatioString = (n: number) => {
  return (Math.round(n * 10) / 10).toFixed(1);
};

const View = (props: {
  equity?: TypeDartStatementItem;
  netIncome?: TypeDartStatementItem;
  consolidated?: boolean;
}) => {
  const { equity, netIncome, consolidated } = props;

  const { company } = useRecoilValue(StateCurrentTab);
  const dailyReq: TypePriceRequest = { code: company.srtnCd, type: 'daily' };
  const prices = useGetPrices(dailyReq);
  const latestPrice = prices.data?.[prices.data.length - 1];
  const cap = (latestPrice?.close ?? 0) * (latestPrice?.base_stock_cnt ?? 0);
  const net = Number.parseInt(netIncome?.thstrm_amount ?? '0');
  const equ = Number.parseInt(equity?.thstrm_amount ?? '0');

  return (
    <div className={styles.diagram}>
      <div className={styles.diagramWrapper}>
        <div className={styles.diagramMarketCap}>
          <h5>Market Cap (시가총액)</h5>
          <span>{shortenNumStringMillion(`${cap}`)}</span>
        </div>
        <div className={styles.diagramEquity}>
          <h5>Equity (자본)</h5>
          <span>{shortenNumStringMillion(equity?.thstrm_amount)}</span>
        </div>
        <div className={styles.diagramNetIncome}>
          <h5>Net Income (순이익)</h5>
          <span>{shortenNumStringMillion(netIncome?.thstrm_amount)}</span>
        </div>
        <div className={styles.diagramPBR}>
          <h5>PBR</h5>
          <span>{`${getRatioString(cap / equ)} x`}</span>
        </div>
        <div className={styles.diagramPER}>
          <h5>PER</h5>
          <span>{`${getRatioString(cap / net)} x`}</span>
        </div>
        <div className={styles.diagramROE}>
          <h5>ROE</h5>
          <span>{`${getRatioString((net / equ) * 100)} %`}</span>
        </div>
      </div>
      {consolidated && (
        <div
          className={styles.inform}
          title="Based on controlling interest of consolidated statements"
        >
          <span className="material-symbols-outlined">info</span>
          <p>Based on controlling interest of consolidated statements</p>
        </div>
      )}
    </div>
  );
};

export default View;
