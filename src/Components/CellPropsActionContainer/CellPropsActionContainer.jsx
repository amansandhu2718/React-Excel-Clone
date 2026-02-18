import styles from "./CellPropsActionContainer.module.css";
import { FaBold } from "react-icons/fa";
import { FaAlignLeft } from "react-icons/fa";
import { FaAlignRight } from "react-icons/fa";
import { FaAlignCenter } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa";
import { FaCut } from "react-icons/fa";
import { FaPaste } from "react-icons/fa";
import { Input, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleBold,
  toggleItalic,
  switchAlignment,
  setFontFamily,
  setFontSize,
  changeFontColor,
  changeBgColor,
} from "../REDUX/Features/CellsSlice";
import { FaItalic } from "react-icons/fa";

const sizeValue = 28;
function CellPropsActionContainer() {
  const dispatch = useDispatch();
  // Use two selectors (no new object returned) to avoid:
  // "Selector unknown returned a different result when called with the same parameters"
  const selectedCellId = useSelector(
    (state) => state.sheet?.selectedCell || "",
  );
  let selectedCell = useSelector((state) =>
    selectedCellId ? (state.sheet?.cells?.[selectedCellId] ?? null) : null,
  );

  if (selectedCell == null) {
    selectedCell = {
      value: "",
      isBold: false,
      isItalic: false,
      align: "left",
      fontColor: "#000000",
      bgColor: "#ffffff",
      fontFamily: "roboto",
      fontSize: "1rem",
    };
  }

  function HandleBold(e) {
    e.preventDefault();
    dispatch(toggleBold({ id: selectedCellId }));
  }
  function HandleItalic(e) {
    e.preventDefault();
    dispatch(toggleItalic({ id: selectedCellId }));
  }
  function HandleAlign(e, val) {
    e.preventDefault();
    dispatch(switchAlignment({ id: selectedCellId, val: val }));
  }
  function handleFontFamilyChange(e) {
    const fontFamily = e.target.value;
    dispatch(setFontFamily({ id: selectedCellId, fontFamily }));
  }

  function handleFontSizeChange(e) {
    const fontSize = e.target.value;
    dispatch(setFontSize({ id: selectedCellId, fontSize }));
  }

  function handleFontColorChange(e) {
    const fontColor = e.target.value;
    dispatch(changeFontColor({ id: selectedCellId, fontColor }));
  }

  function handleBgColorChange(e) {
    const bgColor = e.target.value;
    dispatch(changeBgColor({ id: selectedCellId, bgColor }));
  }
  const align = selectedCell?.align ?? "left";

  return (
    <>
      <div className={styles.parent}>
        <FaCopy size={sizeValue} className={styles.action} />
        <FaCut size={sizeValue} className={styles.action} />
        <FaPaste size={sizeValue} className={styles.action} />
        <Select
          value={selectedCell.fontFamily || "roboto"}
          sx={{
            height: "1.6rem",
            minWidth: "8rem",
          }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          onChange={handleFontFamilyChange}
          onMouseDown={(e) => e.preventDefault()}
        >
          <MenuItem value={"roboto"}>Roboto</MenuItem>
          <MenuItem value={"san-serif"}>San-Serif</MenuItem>
          <MenuItem value={"ariel"}>Ariel</MenuItem>
        </Select>
        <Select
          value={selectedCell.fontSize || "1rem"}
          sx={{
            height: "1.6rem",
            minWidth: "4rem",
          }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          onChange={handleFontSizeChange}
          onMouseDown={(e) => e.preventDefault()}
        >
          <MenuItem value={"1rem"}>10</MenuItem>
          <MenuItem value={"1.1rem"}>11</MenuItem>
          <MenuItem value={"1.2rem"}>12</MenuItem>
          <MenuItem value={"1.3rem"}>13</MenuItem>
          <MenuItem value={"1.4rem"}>14</MenuItem>
          <MenuItem value={"1.5rem"}>15</MenuItem>
          <MenuItem value={"1.6rem"}>16</MenuItem>
          <MenuItem value={"1.7rem"}>17</MenuItem>
          <MenuItem value={"1.8rem"}>18</MenuItem>
          <MenuItem value={"1.9rem"}>19</MenuItem>
          <MenuItem value={"2.0rem"}>20</MenuItem>
        </Select>
        <FaBold
          size={sizeValue}
          className={selectedCell.isBold ? styles.actionActive : styles.action}
          onClick={HandleBold}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        />
        <FaItalic
          size={sizeValue}
          className={
            selectedCell.isItalic ? styles.actionActive : styles.action
          }
          onClick={HandleItalic}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        />
        <FaAlignLeft
          size={sizeValue}
          className={align == "left" ? styles.actionActive : styles.action}
          onClick={(e) => {
            HandleAlign(e, "left");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        />

        <FaAlignCenter
          size={sizeValue}
          className={align == "center" ? styles.actionActive : styles.action}
          onClick={(e) => {
            HandleAlign(e, "center");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        />
        <FaAlignRight
          size={sizeValue}
          className={align == "right" ? styles.actionActive : styles.action}
          onClick={(e) => {
            HandleAlign(e, "right");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        />
        <div className={styles.colorPickerContainer}>
          <label htmlFor="fontColor" className={styles.colorLabel}>
            A
          </label>
          <input
            id="fontColor"
            type="color"
            value={selectedCell.fontColor || "#000000"}
            onChange={handleFontColorChange}
            className={styles.colorInput}
          />
        </div>
        <div className={styles.colorPickerContainer}>
          <label htmlFor="bgColor" className={styles.colorLabel}>
            BG
          </label>
          <input
            id="bgColor"
            type="color"
            value={selectedCell.bgColor || "#ffffff"}
            onChange={handleBgColorChange}
            className={styles.colorInput}
          />
        </div>
      </div>
    </>
  );
}

export default CellPropsActionContainer;
