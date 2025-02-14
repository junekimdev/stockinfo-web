import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useGetPricesLatestAll } from '../../controllers/net/price';
import styles from './marketcap.module.scss';
import { useDraw } from './marketcapInteractor';
import Header from './marketcapViewHeader';
import Loading from './marketcapViewLoading';

const Presenter = () => {
  const { data, isError, error } = useGetPricesLatestAll();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      console.error(error.message);
      alert(error.message);
      router.replace('/search').then(() => {});
    }
  }, [error, isError, router]);

  const svgID = styles.treemap;
  useDraw(svgID);

  return (
    <section className={styles.container}>
      <Header svgID={svgID} />
      <div className={styles.treemapWrapper}>
        <svg id={svgID} className={data?.treemap ? styles.treemap : styles.treemapHidden}></svg>
        {!data?.treemap && <Loading />}
      </div>
    </section>
  );
};

export default Presenter;
