import styles from "./SheetContainer.module.css";
import { BsFileEarmarkSpreadsheetFill } from "react-icons/bs";

export default function SheetContainer() {
  return (
    <>
      <div className={styles.parent}>
        <BsFileEarmarkSpreadsheetFill size={25} />
        <p className={`${styles.sheet} ${styles.sheetActive}`}>Sheet 1</p>
        <p className={styles.sheet}>Sheet 2</p>
        <p className={styles.sheet}>Sheet 3</p>
        <p className={styles.sheet}>Sheet 4</p>
      </div>
    </>
  );
}
