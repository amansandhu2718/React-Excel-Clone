import React, { useState } from "react";
import styles from "./PageActionContainer.module.css";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../REDUX/Features/AuthSlice";
import { AiOutlineLogout, AiOutlineFileExcel, AiOutlineCheckCircle, AiOutlineSync, AiOutlineSave } from "react-icons/ai";
import { exportToExcel } from "../../utils/excelUtils";
import { setWorkbookName } from "../REDUX/Features/CellsSlice";
import { setSaved } from "../REDUX/Features/PersistenceSlice";

function PageActionContainer() {
  const dispatch = useDispatch();
  const { sheets, sheetOrder, workbookName } = useSelector((state) => state.sheet);
  const { status: persistenceStatus } = useSelector((state) => state.persistence);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(workbookName);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleFileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFileClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    exportToExcel(sheets, sheetOrder, workbookName);
    handleFileClose();
  };

  const handleSaveManual = () => {
    // Manually trigger a save to local storage
    try {
      const serializedState = JSON.stringify({ sheets, sheetOrder, workbookName });
      localStorage.setItem("excel_clone_state", serializedState);
      dispatch(setSaved());
    } catch (err) {
      console.error("Manual save failed:", err);
    }
    handleFileClose();
  };

  const handleRenameSubmit = () => {
    dispatch(setWorkbookName(tempName));
    setIsEditingName(false);
  };

  return (
    <div className={styles.parent}>
      {isEditingName ? (
        <input
          autoFocus
          className={styles.workbookNameInput}
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
        />
      ) : (
        <div
          className={styles.workbookNameDisplay}
          onClick={() => {
            setTempName(workbookName);
            setIsEditingName(true);
          }}
        >
          {workbookName}
        </div>
      )}

      <div className={`${styles.pageAction} ${styles.pageActionActive}`}>
        Home
      </div>
      <div className={styles.pageAction} onClick={handleFileClick}>
        File
      </div>
      <div className={styles.pageAction}>Insert</div>
      <div className={styles.pageAction}>Layout</div>
      <div className={styles.pageAction}>Help</div>

      <Box sx={{ flex: 1 }} />

      {/* Persistence Status Indicator */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.85rem",
          mr: 3,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          alignSelf: "center",
          borderRadius: "20px",
          transition: "all 0.3s ease",
        }}
      >
        {persistenceStatus === "saving" ? (
          <>
            <AiOutlineSync
              className={styles.spinningIcon}
              size={25}
              style={{ color: "#ffd700" }}
            />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <AiOutlineCheckCircle size={25} style={{ color: "#ffffffff" }} />
            <span>Saved to local storage</span>
          </>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFileClose}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
            "& .MuiMenuItem-root": {
              fontSize: "0.9rem",
              px: 2,
              py: 1,
            },
          },
        }}
      >
        <MenuItem onClick={handleSaveManual}>
          <AiOutlineSave
            size={20}
            style={{ marginRight: "10px", color: "#1a73e8" }}
          />
          Save
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <AiOutlineFileExcel
            size={20}
            style={{ marginRight: "10px", color: "#188038" }}
          />
          Export as Excel (.xlsx)
        </MenuItem>
      </Menu>

      <Button
        onClick={handleLogout}
        startIcon={<AiOutlineLogout />}
        sx={{
          alignSelf: "center",
          color: "white",
          textTransform: "none",
          mr: 2,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}

export default PageActionContainer;
