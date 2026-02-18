import { TextField } from "@mui/material";
import styles from "./FormulaActionContainer.module.css";
import { AiOutlineFunction } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { applyFormula } from "../REDUX/Features/CellsSlice";

function FormulaActionContainer() {
  const dispatch = useDispatch();
  const selectedCellId = useSelector((state) => state.sheet?.selectedCell || "");
  const formulaFromState = useSelector((state) => state.sheet?.cells?.[selectedCellId]?.formula || "");

  const [formulaValue, setFormulaValue] = useState("");

  useEffect(() => {
    setFormulaValue(formulaFromState);
  }, [formulaFromState, selectedCellId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && selectedCellId) {
      dispatch(applyFormula({ id: selectedCellId, formula: formulaValue }));
    }
  };

  return (
    <>
      <div className={styles.parent}>
        <TextField
          sx={{
            width: "5rem",
            "& .MuiOutlinedInput-root": {
              height: "1.5rem",
              background: "#ffffff",
            },
          }}
          disabled
          hiddenLabel
          id="cell-id-display"
          variant="outlined"
          value={selectedCellId}
          placeholder="cell"
        />
        <AiOutlineFunction size={26} />
        <TextField
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: "1.5rem",
              background: "#ffffff",
            },
          }}
          hiddenLabel
          id="formula-input"
          variant="outlined"
          value={formulaValue}
          onChange={(e) => setFormulaValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Formula"
        />
      </div>
    </>
  );
}

export default FormulaActionContainer;
