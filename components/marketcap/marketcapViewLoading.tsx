import styles from './marketcap.module.scss';

const View = () => {
  return (
    <div className={styles.loading}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <p>Loading...</p>
    </div>
  );
};

export default View;
