import * as gType from '../../controllers/data/types';
import styles from './search.module.scss';
import { useCompanyClick } from './searchInteractor';

const View = (props: { data: gType.Company; uuid: string }) => {
  const { data, uuid } = props;
  const { itmsNm, srtnCd, mrktCtg, corpNm } = data;
  const onCompanyClick = useCompanyClick(uuid, data);

  return (
    <li className={styles.companyCard} onClick={onCompanyClick}>
      <div className={styles.companyName} title={itmsNm}>
        {itmsNm}
      </div>
      <div className={styles.companyCode}>{srtnCd}</div>
      <div className={styles.companyMkt}>{mrktCtg}</div>
      <div className={styles.companyCorp} title={corpNm}>
        {corpNm}
      </div>
    </li>
  );
};

export default View;
