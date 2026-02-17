import styles from "./PageActionContainer.module.css";
export default function PageActionContainer() {
  return (
    <>
      <div className={styles.parent}>
        <div
          style={{
            // alignSelf: "center",
            paddingLeft: "10px",
            paddingRight: "30px",
            color: "white",
            // fontWeight: "bolder",
            fontSize: "1.8rem",
            fontFamily: "Monoton, sans-serif",
          }}
        >
          EXCEL
        </div>
        <div className={`${styles.pageAction} ${styles.pageActionActive}`}>
          Home
        </div>
        <div className={styles.pageAction}>File</div>
        <div className={styles.pageAction}>Insert</div>
        <div className={styles.pageAction}>Layout</div>
        <div className={styles.pageAction}>Help</div>
      </div>
    </>
  );
}
