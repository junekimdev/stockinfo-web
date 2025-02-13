import * as gType from '../../controllers/data/types';
import { shortenNumStringMillion } from '../../controllers/number';
import styles from './details.module.scss';

const getLiabilitiesRatio = (liabilities?: string, equity?: string) => {
  if (!liabilities || !equity) return;
  const n = Math.round((Number.parseInt(liabilities) / Number.parseInt(equity)) * 1000) / 10;
  return n.toFixed(1);
};

const View = (props: {
  assets?: gType.DartStatementItem;
  liabilities?: gType.DartStatementItem;
  equity?: gType.DartStatementItem;
  consolidated?: boolean;
}) => {
  const { assets, liabilities, equity, consolidated = false } = props;
  const ratioCur = getLiabilitiesRatio(liabilities?.thstrm_amount, equity?.thstrm_amount);
  const ratio1stPrior = getLiabilitiesRatio(liabilities?.frmtrm_amount, equity?.frmtrm_amount);
  const ratio2ndPrior = getLiabilitiesRatio(
    liabilities?.bfefrmtrm_amount,
    equity?.bfefrmtrm_amount,
  );

  return (
    <div className={styles.tableContainer}>
      <h2>
        {consolidated
          ? 'Consolidated Statement of Financial Position'
          : 'Statement of Financial Position'}
        <br />
        {consolidated ? '(연결 재무상태표)' : '(재무상태표)'}
      </h2>
      <table>
        <colgroup>
          <col span={1} />
          <col span={1} className={styles.currentTerm} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{`Current (${assets?.bsns_year})`}</th>
            <th scope="col">Prior</th>
            <th scope="col">2nd Prior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              Assets
              <br />
              (자산)
            </th>
            <td>{shortenNumStringMillion(assets?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(assets?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(assets?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              Liabilities
              <br />
              (부채)
            </th>
            <td>{shortenNumStringMillion(liabilities?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(liabilities?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(liabilities?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              {consolidated ? 'Equity CI' : 'Equity'}
              <br />
              {consolidated ? '(지배지분 자본)' : '(자본)'}
            </th>
            <td>{shortenNumStringMillion(equity?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(equity?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(equity?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              Debt Ratio
              <br />
              (부채비율)
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
