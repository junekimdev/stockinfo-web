import { TypeCompanyTab } from '../../controllers/data/types';
import styles from './mainFrame.module.scss';
import { useMoveToTabClick, useRemoveTabClick } from './mainFrameInteractor';

const View = (props: { tab: TypeCompanyTab }) => {
  const { tab } = props;
  const onMoveToTabClick = useMoveToTabClick(tab);
  const onRemoveTabClick = useRemoveTabClick(tab);

  return (
    <li title={tab.company.itmsNm} className={styles.tabItem} onClick={onMoveToTabClick}>
      <i
        title="close"
        className={`fa-solid fa-xmark ${styles.tabItemClose}`}
        onClick={onRemoveTabClick}
      ></i>
      <div className={styles.tabItemText}>{tab.company.itmsNm}</div>
    </li>
  );
};

export default View;
