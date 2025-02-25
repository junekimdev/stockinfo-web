import * as gType from '../../controllers/data/types';
import { shortenNumStringMillion } from '../../controllers/number';
import styles from './details.module.scss';

const getOperatingIncomeRatio = (operatingIncome?: string, revenue?: string) => {
  if (!operatingIncome || !revenue) return;
  const n = Math.round((Number.parseInt(operatingIncome) / Number.parseInt(revenue)) * 1000) / 10;
  return n.toFixed(1);
};

const View = (props: {
  revenue?: gType.DartStatementItem;
  operatingIncome?: gType.DartStatementItem;
  netIncome?: gType.DartStatementItem;
  comprehensiveIncome?: gType.DartStatementItem;
  consolidated?: boolean;
}) => {
  const { revenue, operatingIncome, netIncome, comprehensiveIncome, consolidated = false } = props;
  const ratioCur = getOperatingIncomeRatio(operatingIncome?.thstrm_amount, revenue?.thstrm_amount);
  const ratio1stPrior = getOperatingIncomeRatio(
    operatingIncome?.frmtrm_amount,
    revenue?.frmtrm_amount,
  );
  const ratio2ndPrior = getOperatingIncomeRatio(
    operatingIncome?.bfefrmtrm_amount,
    revenue?.bfefrmtrm_amount,
  );

  return (
    <div className={styles.tableContainer}>
      <h2>
        {consolidated ? 'Consolidated Statement of Income' : 'Statement of Income'}
        <br />
        {consolidated ? '(연결 손익계산서)' : '(손익계산서)'}
      </h2>
      <table>
        <colgroup>
          <col span={1} />
          <col span={1} className={styles.currentTerm} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{`Current (${revenue?.bsns_year})`}</th>
            <th scope="col">Prior</th>
            <th scope="col">2nd Prior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              Sales Revenue
              <br />
              (매출액)
            </th>
            <td>{shortenNumStringMillion(revenue?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(revenue?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(revenue?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              Operating Income
              <br />
              (영업이익)
            </th>
            <td>{shortenNumStringMillion(operatingIncome?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(operatingIncome?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(operatingIncome?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              {consolidated ? 'Net Income CI' : 'Net Income'}
              <br />
              {consolidated ? '(지배지분 순이익)' : '(순이익)'}
            </th>
            <td>{shortenNumStringMillion(netIncome?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(netIncome?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(netIncome?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              {consolidated ? 'Comprehensive Income CI' : 'Comprehensive Income'}
              <br />
              {consolidated ? '(지배지분 포괄순이익)' : '(포괄순이익)'}
            </th>
            <td>{shortenNumStringMillion(comprehensiveIncome?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(comprehensiveIncome?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(comprehensiveIncome?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              Operating Income Ratio
              <br />
              (영업이익률)
            </th>
            <td>{ratioCur ? `${ratioCur} %` : undefined}</td>
            <td>{ratio1stPrior ? `${ratio1stPrior} %` : undefined}</td>
            <td>{ratio2ndPrior ? `${ratio2ndPrior} %` : undefined}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default View;
