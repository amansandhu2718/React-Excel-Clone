import React, { useState } from "react";
import styles from "./SheetContainer.module.css";
import { BsFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveSheet,
  addSheet,
  deleteSheet,
  renameSheet,
} from "../REDUX/Features/CellsSlice";
import { Menu, MenuItem, IconButton } from "@mui/material";

export default function SheetContainer() {
  const dispatch = useDispatch();
  const { sheets, sheetOrder, activeSheetId } = useSelector(
    (state) => state.sheet
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [contextSheetId, setContextSheetId] = useState(null);
  const [editingSheetId, setEditingSheetId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleContextMenu = (event, sheetId) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setContextSheetId(sheetId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setContextSheetId(null);
  };

  const handleDelete = () => {
    if (contextSheetId) {
      dispatch(deleteSheet(contextSheetId));
    }
    handleClose();
  };

  const handleRenameStart = () => {
    setEditingSheetId(contextSheetId);
    setEditName(sheets[contextSheetId].name);
    handleClose();
  };

  const handleRenameSubmit = (e) => {
    if (e.key === "Enter") {
      dispatch(renameSheet({ sheetId: editingSheetId, name: editName }));
      setEditingSheetId(null);
    }
    if (e.key === "Escape") {
      setEditingSheetId(null);
    }
  };

  return (
    <div className={styles.parent}>
      {sheetOrder.map((id) => (
        <div
          key={id}
          className={`${styles.sheet} ${id === activeSheetId ? styles.sheetActive : ""
            }`}
          onClick={() => dispatch(setActiveSheet(id))}
          onContextMenu={(e) => handleContextMenu(e, id)}
        >
          {editingSheetId === id ? (
            <input
              autoFocus
              className={styles.renameInput}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleRenameSubmit}
              onBlur={() => setEditingSheetId(null)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <BsFileEarmarkSpreadsheetFill
                size={18}
                color={id === activeSheetId ? "#188038" : "#5f6368"}
              />
              <span>{sheets[id].name}</span>
            </>
          )}
        </div>
      ))}

      <div className={styles.addButton} onClick={() => dispatch(addSheet())}>
        <FiPlus size={22} />
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={handleRenameStart}>Rename</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
