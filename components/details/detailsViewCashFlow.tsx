import * as gType from '../../controllers/data/types';
import { shortenNumStringMillion } from '../../controllers/number';
import styles from './details.module.scss';

const View = (props: {
  cashflowOperating?: gType.DartStatementItem;
  cashflowInvesting?: gType.DartStatementItem;
  cashflowFinancing?: gType.DartStatementItem;
  consolidated?: boolean;
}) => {
  const { cashflowOperating, cashflowInvesting, cashflowFinancing, consolidated = false } = props;
  return (
    <div className={styles.tableContainer}>
      <h2>
        {consolidated ? 'Consolidated Statement of Cash Flows' : 'Statement of Cash Flows'}
        <br />
        {consolidated ? '(연결 현금흐름표)' : '(현금흐름표)'}
      </h2>
      <table>
        <colgroup>
          <col span={1} />
          <col span={1} className={styles.currentTerm} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{`Current (${cashflowOperating?.bsns_year})`}</th>
            <th scope="col">Prior</th>
            <th scope="col">2nd Prior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              Operating Activities
              <br />
              (영업활동)
            </th>
            <td>{shortenNumStringMillion(cashflowOperating?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(cashflowOperating?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(cashflowOperating?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              Investing Activities
              <br />
              (투자활동)
            </th>
            <td>{shortenNumStringMillion(cashflowInvesting?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(cashflowInvesting?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(cashflowInvesting?.bfefrmtrm_amount)}</td>
          </tr>
          <tr>
            <th scope="row">
              Financing Activities
              <br />
              (재무활동)
            </th>
            <td>{shortenNumStringMillion(cashflowFinancing?.thstrm_amount)}</td>
            <td>{shortenNumStringMillion(cashflowFinancing?.frmtrm_amount)}</td>
            <td>{shortenNumStringMillion(cashflowFinancing?.bfefrmtrm_amount)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default View;
