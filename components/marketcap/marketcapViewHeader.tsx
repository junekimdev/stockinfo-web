import { getDatetimeString } from '../../controllers/datetime';
import { useGetPricesSnapshot } from '../../controllers/net/price';
import styles from './marketcap.module.scss';
import { useDownloadClick } from './marketcapInteractor';

const View = (props: { svgID: string }) => {
  const { svgID } = props;
  const { data } = useGetPricesSnapshot();
  const timestamp = (data?.current_datetime?.getTime() ?? 0) / 1000; // in seconds
  const filename = `jkstock_krx_treemap_${timestamp}`;

  const onDownloadClick = useDownloadClick(svgID, filename);
  const onDownloadNotReadyClick = () => alert('Image is not yet ready to download');

  return (
    <header className={styles.header}>
      <h3 className={styles.headerTitle}>KRX Treemap sorted by Market Cap</h3>
      <div>
        {data?.current_datetime ? `updated ${getDatetimeString(data.current_datetime)}` : ''}
      </div>
      <div
        className={styles.downloadBtn}
        title="Download Treemap"
        onClick={data?.treemap ? onDownloadClick : onDownloadNotReadyClick}
      >
        <i className="fa-solid fa-download"></i>
      </div>
    </header>
  );
};

export default View;
