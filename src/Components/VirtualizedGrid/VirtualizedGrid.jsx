// src/Components/VirtualGridContainer/VirtualGridContainer.jsx
import React from "react";
import styles from "./VirtualGridContainer.module.css";
import { encodeColumn } from "../../utils/columnUtils";
import { useDispatch, useSelector } from "react-redux";
import { addValue, updateSelected } from "../REDUX/Features/CellsSlice";

const ROW_COUNT = 1000; //depends on user created
const COL_COUNT = 1000; //depends on user created

const ROW_HEIGHT = 32; // px (keep consistent with CSS)
const COL_WIDTH = 96; // px
const OVERSCAN = 5;

const range = (start, end) => {
  const res = [];
  for (let i = start; i <= end; i++) res.push(i);
  return res;
};

function VirtualGridContainer() {
  const viewportRef = React.useRef(null);

  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0,
    scrollTop: 0,
    scrollLeft: 0,
  });

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateSize = () => {
      setViewport((prev) => ({
        ...prev,
        width: el.clientWidth,
        height: el.clientHeight,
      }));
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setViewport((prev) => ({
      ...prev,
      scrollTop: el.scrollTop,
      scrollLeft: el.scrollLeft,
    }));
  };

  const { width, height, scrollTop, scrollLeft } = viewport;

  if (!width || !height) {
    // Render an empty scroll viewport until measured
    return (
      <div className={styles.root}>
        <div className={styles.headerRow}>
          <div className={styles.corner} />
          <div className={styles.columnHeaderViewport} />
        </div>
        <div ref={viewportRef} className={styles.viewport} />
      </div>
    );
  }

  const firstRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const lastRow = Math.min(
    ROW_COUNT - 1,
    Math.floor((scrollTop + height) / ROW_HEIGHT) + OVERSCAN,
  );

  const firstCol = Math.max(0, Math.floor(scrollLeft / COL_WIDTH) - OVERSCAN);
  const lastCol = Math.min(
    COL_COUNT - 1,
    Math.floor((scrollLeft + width) / COL_WIDTH) + OVERSCAN,
  );

  return (
    <div className={styles.root}>
      {/* Top: corner + column headers */}
      <div className={styles.headerRow}>
        <div className={styles.corner}>#</div>

        <div className={styles.columnHeaderViewport}>
          <div
            className={styles.columnHeaderInner}
            style={{
              width: COL_COUNT * COL_WIDTH,
              transform: `translateX(-${scrollLeft}px)`,
            }}
          >
            {range(firstCol, lastCol).map((colIndex) => (
              <div
                key={colIndex}
                className={styles.columnHeaderCell}
                style={{
                  left: colIndex * COL_WIDTH,
                  width: COL_WIDTH,
                  height: ROW_HEIGHT,
                }}
              >
                {encodeColumn(colIndex)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bodyRow}>
        {/* Row headers */}
        <div className={styles.rowHeaderViewport}>
          <div
            className={styles.rowHeaderInner}
            style={{
              height: ROW_COUNT * ROW_HEIGHT,
              transform: `translateY(-${scrollTop}px)`,
            }}
          >
            {range(firstRow, lastRow).map((rowIndex) => (
              <div
                key={rowIndex}
                className={styles.rowHeaderCell}
                style={{
                  top: rowIndex * ROW_HEIGHT,
                  height: ROW_HEIGHT,
                  width: "100%",
                }}
              >
                {rowIndex + 1}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={viewportRef}
          className={styles.viewport}
          onScroll={handleScroll}
        >
          <div
            className={styles.inner}
            style={{
              height: ROW_COUNT * ROW_HEIGHT,
              width: COL_COUNT * COL_WIDTH,
            }}
          >
            {range(firstRow, lastRow).map((rowIndex) =>
              range(firstCol, lastCol).map((colIndex) => {
                const id = `${encodeColumn(colIndex)}${rowIndex + 1}`;
                return (
                  <div
                    key={id}
                    className={styles.cellWrapper}
                    style={{
                      top: rowIndex * ROW_HEIGHT,
                      left: colIndex * COL_WIDTH,
                      height: ROW_HEIGHT,
                      width: COL_WIDTH,
                    }}
                  >
                    <Cell id={id} />
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
      autoFocus={id === "0-A"}
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
        color: data?.fontColor || "#000000",
        backgroundColor: data?.bgColor || "#ffffff",
      }}
    />
  );
});

export default VirtualGridContainer;
