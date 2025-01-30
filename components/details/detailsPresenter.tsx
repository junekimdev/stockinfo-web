import { useAtomValue } from 'jotai';
import { useToggleDetails } from '../../controllers/data/hooks';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypeDartStatementRes } from '../../controllers/data/types';
import { useGetDartCode, useGetDartStatement } from '../../controllers/net/dart';
import styles from './details.module.scss';
import CashFlow from './detailsViewCashFlow';
import Diagram from './detailsViewDiagram';
import Header from './detailsViewHeader';
import Income from './detailsViewIncome';
import SoFP from './detailsViewSoFP';

const getData = (res: TypeDartStatementRes | undefined, sj_div: string, account_id: string) => {
  return res?.list?.filter((v) => v.sj_div === sj_div && v.account_id === account_id)[0];
};

const Presenter = () => {
  const { company } = useAtomValue(StateCurrentTab);
  const { data: dartCode } = useGetDartCode(company.srtnCd);
  const { data: cfs_data } = useGetDartStatement(dartCode ?? '', '11011', 'CFS');
  const { data: fs_data } = useGetDartStatement(dartCode ?? '', '11011', 'OFS');

  const cfs_assets = getData(cfs_data, 'BS', 'ifrs-full_Assets');
  const cfs_equityCI = getData(cfs_data, 'BS', 'ifrs-full_EquityAttributableToOwnersOfParent');
  const cfs_liabilities = getData(cfs_data, 'BS', 'ifrs-full_Liabilities');
  // const cfs_assets_current = getData(cfs_data, 'BS', 'ifrs-full_CurrentAsset');
  // const cfs_assets_non_current = getData(cfs_data, 'BS', 'ifrs-full_NoncurrentAssets');
  // const cfs_liabilities_current = getData(cfs_data, 'BS', 'ifrs-full_CurrentLiabilities');
  // const cfs_liabilities_non_current = getData(cfs_data, 'BS', 'ifrs-full_NoncurrentLiabilities');
  const cfs_revenue =
    getData(cfs_data, 'CIS', 'ifrs-full_Revenue') ?? getData(cfs_data, 'IS', 'ifrs-full_Revenue');
  const cfs_operatingIncome =
    getData(cfs_data, 'CIS', 'dart_OperatingIncomeLoss') ??
    getData(cfs_data, 'IS', 'dart_OperatingIncomeLoss');
  const cfs_netIncomeCI =
    getData(cfs_data, 'CIS', 'ifrs-full_ProfitLossAttributableToOwnersOfParent') ??
    getData(cfs_data, 'IS', 'ifrs-full_ProfitLossAttributableToOwnersOfParent');
  const cfs_comprehensiveIncomeCI =
    getData(cfs_data, 'CIS', 'ifrs-full_ComprehensiveIncomeAttributableToOwnersOfParent') ??
    getData(cfs_data, 'IS', 'ifrs-full_ComprehensiveIncomeAttributableToOwnersOfParent');
  const cfs_cashflowOperating = getData(
    cfs_data,
    'CF',
    'ifrs-full_CashFlowsFromUsedInOperatingActivities',
  );
  const cfs_cashflowInvesting = getData(
    cfs_data,
    'CF',
    'ifrs-full_CashFlowsFromUsedInInvestingActivities',
  );
  const cfs_cashflowFinancing = getData(
    cfs_data,
    'CF',
    'ifrs-full_CashFlowsFromUsedInFinancingActivities',
  );

  const fs_assets = getData(fs_data, 'BS', 'ifrs-full_Assets');
  const fs_equity = getData(fs_data, 'BS', 'ifrs-full_Equity');
  const fs_liabilities = getData(fs_data, 'BS', 'ifrs-full_Liabilities');
  const fs_revenue =
    getData(fs_data, 'CIS', 'ifrs-full_Revenue') ?? getData(fs_data, 'IS', 'ifrs-full_Revenue');
  const fs_operatingIncome =
    getData(fs_data, 'CIS', 'dart_OperatingIncomeLoss') ??
    getData(fs_data, 'IS', 'dart_OperatingIncomeLoss');
  const fs_netIncome =
    getData(fs_data, 'CIS', 'ifrs-full_ProfitLoss') ??
    getData(fs_data, 'IS', 'ifrs-full_ProfitLoss');
  const fs_comprehensiveIncome =
    getData(fs_data, 'CIS', 'ifrs-full_ComprehensiveIncome') ??
    getData(fs_data, 'IS', 'ifrs-full_ComprehensiveIncome');
  const fs_cashflowOperating = getData(
    fs_data,
    'CF',
    'ifrs-full_CashFlowsFromUsedInOperatingActivities',
  );
  const fs_cashflowInvesting = getData(
    fs_data,
    'CF',
    'ifrs-full_CashFlowsFromUsedInInvestingActivities',
  );
  const fs_cashflowFinancing = getData(
    fs_data,
    'CF',
    'ifrs-full_CashFlowsFromUsedInFinancingActivities',
  );

  const onToggleDetails = useToggleDetails();
  return (
    <section className={styles.container}>
      <div className={styles.closeBtn} onClick={onToggleDetails}></div>
      <div className={styles.details}>
        {fs_data?.list?.length ? (
          <>
            <Header />
            {cfs_data?.list?.length ? (
              <Diagram
                equity={cfs_equityCI}
                netIncome={cfs_netIncomeCI}
                consolidated={!!cfs_data?.list?.length}
              />
            ) : (
              <Diagram
                equity={fs_equity}
                netIncome={fs_netIncome}
                consolidated={!!cfs_data?.list?.length}
              />
            )}
            <hr />
            {cfs_data?.list?.length && (
              <>
                <SoFP
                  assets={cfs_assets}
                  liabilities={cfs_liabilities}
                  equity={cfs_equityCI}
                  consolidated
                />
                <hr />
                <Income
                  revenue={cfs_revenue}
                  operatingIncome={cfs_operatingIncome}
                  netIncome={cfs_netIncomeCI}
                  comprehensiveIncome={cfs_comprehensiveIncomeCI}
                  consolidated
                />
                <hr />
                <CashFlow
                  cashflowOperating={cfs_cashflowOperating}
                  cashflowInvesting={cfs_cashflowInvesting}
                  cashflowFinancing={cfs_cashflowFinancing}
                  consolidated
                />
                <hr />
              </>
            )}
            <SoFP assets={fs_assets} liabilities={fs_liabilities} equity={fs_equity} />
            <hr />
            <Income
              revenue={fs_revenue}
              operatingIncome={fs_operatingIncome}
              netIncome={fs_netIncome}
              comprehensiveIncome={fs_comprehensiveIncome}
            />
            <hr />
            <CashFlow
              cashflowOperating={fs_cashflowOperating}
              cashflowInvesting={fs_cashflowInvesting}
              cashflowFinancing={fs_cashflowFinancing}
            />
            <div
              className={styles.inform}
              title="'Mn' stands for 'Million' (백만) | 'CI' stands for 'Controlling Interest' (지배지분) | Consolidated statement includes child company's statements"
            >
              <span className="material-symbols-outlined">info</span>
              <p>&#39;Mn&#39; stands for &#39;Million&#39; (백만)</p>
              <p>&#39;CI&#39; stands for &#39;Controlling Interest&#39; (지배지분)</p>
              <p>Consolidated statement includes child company&#39;s statements</p>
            </div>
          </>
        ) : (
          <div className={styles.spinner}></div>
        )}
      </div>
    </section>
  );
};

export default Presenter;
