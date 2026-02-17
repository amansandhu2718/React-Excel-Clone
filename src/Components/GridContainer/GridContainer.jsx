// import { useDispatch } from "react-redux";
import styles from "./GridContainer.module.css";
import { addValue, updateSelected } from "./../REDUX/Features/CellsSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { encodeColumn } from "../../utils/columnUtils";

function GridContainer() {
  const rows = 25;
  const cols = 125;

  return (
    <div className={styles.parent}>
      {/* Header */}
      <div className={styles.columnContainer}>
        <div className={styles.dummyContainer}></div>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className={styles.cell}>
            {encodeColumn(i)}
          </div>
        ))}
      </div>
      <div className={styles.wrapper}>
        {/* <div className={styles.rowContainer}></div> */}
        <div className={styles.cellContainer}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className={styles.gridRow}>
              <div className={`${styles.cell} ${styles.rowContainer}`}>
                {rowIndex}
              </div>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Cell
                  key={`${rowIndex}-${encodeColumn(colIndex)}`}
                  id={`${rowIndex}-${encodeColumn(colIndex)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GridContainer;

const Cell = React.memo(({ id }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.sheet?.cells?.[id]);

  const handleChange = (e) => {
    dispatch(addValue({ id, value: e.target.value }));
  };

  const handleFocus = () => {
    dispatch(updateSelected({ id }));
  };

  return (
    <input
      data-id={id}
      autoFocus={id == "0-A" ? true : false}
      onFocus={handleFocus}
      onClick={handleFocus}
      value={data?.value || ""}
      onChange={handleChange}
      className={styles.dataCell}
      style={{
        fontWeight: data?.isBold ? "bolder" : "normal",
        fontStyle: data?.isItalic ? "italic" : "normal",
        textAlign: data?.align || "left",
        fontSize: data?.fontSize || "1rem",
        fontFamily: data?.fontFamily || "roboto",
      }}
    />
  );
});
