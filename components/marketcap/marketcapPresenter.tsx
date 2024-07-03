import styles from './marketcap.module.scss';
import { useDraw } from './marketcapInteractor';
import Header from './marketcapViewHeader';

const Presenter = () => {
  const svgID = styles.treemap;
  useDraw(svgID);

  return (
    <section className={styles.container}>
      <Header svgID={svgID} />
      <div className={styles.treemapWrapper}>
        <svg id={svgID} className={styles.treemap}></svg>
      </div>
    </section>
  );
};

export default Presenter;
