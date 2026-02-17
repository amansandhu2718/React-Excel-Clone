import { TextField } from "@mui/material";
import styles from "./FormulaActionContainer.module.css";
import { AiOutlineFunction } from "react-icons/ai";
import { useSelector } from "react-redux";

function FormulaActionContainer() {
  // const value = useSelector((state) => state.sheet.cells[id]?.value);

  const { selectedCellId } = useSelector((state) => {
    const selectedCellId = state.sheet?.selectedCell || "";

    return { selectedCellId };
  });

  return (
    <>
      <div className={styles.parent}>
        <TextField
          sx={{
            width: "4rem",
            "& .MuiOutlinedInput-root": {
              height: "1.5rem",
              background: "#ffffff",
            },
          }}
          hiddenLabel
          id="filled-hidden-label-normal"
          defaultValue="Normal"
          variant="outlined"
          value={selectedCellId}
          placeholder="cell"
        />
        <AiOutlineFunction size={26} />
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "1.5rem",
              background: "#ffffff",
            },
          }}
          hiddenLabel
          id="filled-hidden-label-normal"
          defaultValue="Normal"
          variant="outlined"
          value=""
          placeholder="Formula"
        />
      </div>
    </>
  );
}

export default FormulaActionContainer;
