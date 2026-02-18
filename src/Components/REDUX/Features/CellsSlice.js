import { createSlice } from "@reduxjs/toolkit";
import { parseCellId, decodeColumn, encodeColumn } from "./../../../utils/columnUtils";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("excel_clone_state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const persistedState = loadState();

const initialState = persistedState 
? { ...persistedState, activeSheetId: persistedState.sheetOrder[0] || "sheet1" }
: {
  workbookName: "Untitled Spreadsheet",
  activeSheetId: "sheet1",
  sheets: {
    sheet1: {
      id: "sheet1",
      name: "Sheet 1",
      cells: {
        A1: {
          value: "10",
          isBold: false,
          isItalic: false,
          align: "left",
          fontColor: "#000000",
          bgColor: "#ffffff",
        },
      },
      selectedCell: "A1",
      selectionRange: { start: "A1", end: "A1" },
    },
  },
  sheetOrder: ["sheet1"],
  isSelecting: false,
};

// Internal helper for range formatting
const applyToRange = (state, callback) => {
  const activeSheet = state.sheets[state.activeSheetId];
  const { start, end } = activeSheet.selectionRange;
  if (!start) {
    if (activeSheet.selectedCell) {
      callback(activeSheet.selectedCell, activeSheet);
    }
    return;
  }

  const startInfo = parseCellId(start);
  const endInfo = parseCellId(end || start);

  if (!startInfo || !endInfo) return;

  const startCol = decodeColumn(startInfo.colLabel);
  const endCol = decodeColumn(endInfo.colLabel);
  const startRow = startInfo.rowNum;
  const endRow = endInfo.rowNum;

  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const id = `${encodeColumn(c)}${r}`;
      callback(id, activeSheet);
    }
  }
};

export const cellsSlice = createSlice({
  name: "sheet",
  initialState,
  reducers: {
    addValue: (state, action) => {
      const { id, value } = action.payload;
      if (id == null) return;

      const activeSheet = state.sheets[state.activeSheetId];
      const cell = activeSheet.cells[id] || {};
      
      // If cell had a formula, remove it and detach from parents
      if (cell.formula) {
        removeFormula(activeSheet, id);
      }

      activeSheet.cells[id] = { ...cell, value, formula: "" };
      updateChildren(activeSheet, id);
    },
    applyFormula: (state, action) => {
      const { id, formula } = action.payload;
      if (!id) return;

      const activeSheet = state.sheets[state.activeSheetId];
      const cell = activeSheet.cells[id] || {};

      // 1. Remove old formula/dependencies if any
      if (cell.formula) {
        removeFormula(activeSheet, id);
      }

      // 2. Add new formula and dependencies
      const parents = extractParents(formula);
      
      // Perform cycle detection using DFS
      if (isCyclePresent(activeSheet, id, parents)) {
        alert("Cycle detected! Formula cannot be applied.");
        return;
      }

      activeSheet.cells[id] = { ...cell, formula, parent: parents };

      parents.forEach(parentId => {
        if (!activeSheet.cells[parentId]) {
          activeSheet.cells[parentId] = { value: "0", children: [] };
        }
        if (!activeSheet.cells[parentId].children) {
          activeSheet.cells[parentId].children = [];
        }
        if (!activeSheet.cells[parentId].children.includes(id)) {
          activeSheet.cells[parentId].children.push(id);
        }
      });

      // 3. Evaluate and update children
      const newValue = evaluateFormula(formula, activeSheet.cells);
      activeSheet.cells[id].value = newValue;
      
      updateChildren(activeSheet, id);
    },
    updateSelected: (state, action) => {
      const activeSheet = state.sheets[state.activeSheetId];
      activeSheet.selectedCell = action.payload.id;
      activeSheet.selectionRange = { start: action.payload.id, end: action.payload.id };
    },
    selectStart: (state, action) => {
      const activeSheet = state.sheets[state.activeSheetId];
      activeSheet.selectedCell = action.payload.id;
      activeSheet.selectionRange = { start: action.payload.id, end: action.payload.id };
      state.isSelecting = true;
    },
    selectEnd: (state, action) => {
      if (state.isSelecting) {
        const activeSheet = state.sheets[state.activeSheetId];
        activeSheet.selectionRange.end = action.payload.id;
      }
    },
    setIsSelecting: (state, action) => {
      state.isSelecting = action.payload;
    },
    toggleBold: (state) => {
      const activeSheet = state.sheets[state.activeSheetId];
      const targetId = activeSheet.selectedCell;
      if (!targetId) return;
      
      const shouldBeBold = !activeSheet.cells[targetId]?.isBold;
      
      applyToRange(state, (id, sheet) => {
        if (!sheet.cells[id]) sheet.cells[id] = {};
        sheet.cells[id].isBold = shouldBeBold;
      });
    },
    toggleItalic: (state) => {
      const activeSheet = state.sheets[state.activeSheetId];
      const targetId = activeSheet.selectedCell;
      if (!targetId) return;

      const shouldBeItalic = !activeSheet.cells[targetId]?.isItalic;

      applyToRange(state, (id, sheet) => {
        if (!sheet.cells[id]) sheet.cells[id] = {};
        sheet.cells[id].isItalic = shouldBeItalic;
      });
    },
    switchAlignment: (state, action) => {
      const { val } = action.payload;
      applyToRange(state, (id, sheet) => {
        if (!sheet.cells[id]) sheet.cells[id] = {};
        sheet.cells[id].align = val;
      });
    },
    setFontFamily: (state, action) => {
      const { fontFamily } = action.payload;
      applyToRange(state, (id, sheet) => {
        if (!sheet.cells[id]) sheet.cells[id] = {};
        sheet.cells[id].fontFamily = fontFamily;
      });
    },
    setFontSize: (state, action) => {
      const { fontSize } = action.payload;
      applyToRange(state, (id, sheet) => {
        if (!sheet.cells[id]) sheet.cells[id] = {};
        sheet.cells[id].fontSize = fontSize;
      });
    },
    changeFontColor: (state, action) => {
      const { fontColor } = action.payload;
      applyToRange(state, (id, sheet) => {
        if (!sheet.cells[id]) sheet.cells[id] = {};
        sheet.cells[id].fontColor = fontColor;
      });
    },
    changeBgColor: (state, action) => {
      const { bgColor } = action.payload;
      applyToRange(state, (id, sheet) => {
        if (!sheet.cells[id]) sheet.cells[id] = {};
        sheet.cells[id].bgColor = bgColor;
      });
    },
    clearFormatting: (state) => {
      applyToRange(state, (id, sheet) => {
        if (sheet.cells[id]) {
          const { value, formula, parent, children } = sheet.cells[id];
          // Keep data but reset styles
          sheet.cells[id] = { value, formula, parent, children };
        }
      });
    },
    // Multiple Sheets Management
    setWorkbookName: (state, action) => {
      state.workbookName = action.payload;
    },
    setActiveSheet: (state, action) => {
      state.activeSheetId = action.payload;
    },
    addSheet: (state) => {
      const newId = `sheet${Date.now()}`;
      const newName = `Sheet ${state.sheetOrder.length + 1}`;
      state.sheets[newId] = {
        id: newId,
        name: newName,
        cells: {},
        selectedCell: "A1",
        selectionRange: { start: "A1", end: "A1" },
      };
      state.sheetOrder.push(newId);
      state.activeSheetId = newId;
    },
    deleteSheet: (state, action) => {
      const sheetId = action.payload;
      if (state.sheetOrder.length <= 1) return; // Don't delete last sheet

      const index = state.sheetOrder.indexOf(sheetId);
      state.sheetOrder = state.sheetOrder.filter(id => id !== sheetId);
      delete state.sheets[sheetId];

      if (state.activeSheetId === sheetId) {
        state.activeSheetId = state.sheetOrder[Math.max(0, index - 1)];
      }
    },
    renameSheet: (state, action) => {
      const { sheetId, name } = action.payload;
      if (state.sheets[sheetId]) {
        state.sheets[sheetId].name = name;
      }
    },
  },
});

export const {
  addValue,
  updateSelected,
  selectStart,
  selectEnd,
  setIsSelecting,
  toggleBold,
  toggleItalic,
  switchAlignment,
  setFontFamily,
  setFontSize,
  applyFormula,
  changeFontColor,
  changeBgColor,
  clearFormatting,
  setWorkbookName,
  setActiveSheet,
  addSheet,
  deleteSheet,
  renameSheet,
} = cellsSlice.actions;

// Helper functions (internal - now accept 'sheet' object)

function extractParents(formula) {
  const matches = formula.match(/[A-Z]+\d+/g);
  return matches ? [...new Set(matches)] : [];
}

function evaluateFormula(formula, cells) {
  try {
    const tokens = formula.split(/([\s()+\-*/])/).filter(t => t.trim().length > 0);
    const evaluatedFormula = tokens.map(token => {
      if (/^[A-Z]+\d+$/.test(token)) {
        const val = cells[token]?.value || "0";
        return isNaN(val) ? 0 : val;
      }
      return token;
    }).join(" ");
    return eval(evaluatedFormula).toString();
  } catch (e) {
    return "ERROR";
  }
}

function updateChildren(sheet, parentId) {
  const children = sheet.cells[parentId]?.children;
  if (!children) return;

  children.forEach(childId => {
    const childCell = sheet.cells[childId];
    if (childCell && childCell.formula) {
      const newValue = evaluateFormula(childCell.formula, sheet.cells);
      sheet.cells[childId].value = newValue;
      updateChildren(sheet, childId);
    }
  });
}

function removeFormula(sheet, id) {
  const cell = sheet.cells[id];
  if (!cell || !cell.parent) return;

  cell.parent.forEach(parentId => {
    const parent = sheet.cells[parentId];
    if (parent && parent.children) {
      parent.children = parent.children.filter(childId => childId !== id);
    }
  });

  sheet.cells[id].parent = [];
  sheet.cells[id].formula = "";
}

function isCyclePresent(sheet, cellId, parents) {
  for (let parentId of parents) {
    if (parentId === cellId) return true;
    if (isReachable(sheet, cellId, parentId)) return true;
  }
  return false;
}

function isReachable(sheet, sourceId, targetId) {
  const children = sheet.cells[sourceId]?.children || [];
  for (let childId of children) {
    if (childId === targetId) return true;
    if (isReachable(sheet, childId, targetId)) return true;
  }
  return false;
}

export default cellsSlice.reducer;
