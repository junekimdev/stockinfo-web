import { TypeCompany } from '../../controllers/data/types';
import styles from './search.module.scss';
import { useCompanyClick } from './searchInteractor';

const View = (props: { data: TypeCompany; uuid: string }) => {
  const { data, uuid } = props;
  const { itmsNm, srtnCd, mrktCtg, corpNm } = data;
  const onuseCompanyClick = useCompanyClick(uuid, data);

  return (
    <li className={styles.companyCard} onClick={onuseCompanyClick}>
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
