import { createSlice } from "@reduxjs/toolkit";
import { parseCellId, decodeColumn, encodeColumn } from "./../../../utils/columnUtils";

const initialState = {
  selectedCell: "",
  selectionRange: { start: null, end: null },
  isSelecting: false,
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
};

// Internal helper for range formatting
const applyToRange = (state, callback) => {
  const { start, end } = state.selectionRange;
  if (!start) {
    if (state.selectedCell) {
      callback(state.selectedCell);
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
      callback(id);
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

      const cell = state.cells[id] || {};
      
      // If cell had a formula, remove it and detach from parents
      if (cell.formula) {
        removeFormula(state, id);
      }

      state.cells[id] = { ...cell, value, formula: "" };
      updateChildren(state, id);
    },
    applyFormula: (state, action) => {
      const { id, formula } = action.payload;
      if (!id) return;

      const cell = state.cells[id] || {};

      // 1. Remove old formula/dependencies if any
      if (cell.formula) {
        removeFormula(state, id);
      }

      // 2. Add new formula and dependencies
      const parents = extractParents(formula);
      
      // Perform cycle detection using DFS
      if (isCyclePresent(state, id, parents)) {
        alert("Cycle detected! Formula cannot be applied.");
        return;
      }

      state.cells[id] = { ...cell, formula, parent: parents };

      parents.forEach(parentId => {
        if (!state.cells[parentId]) {
          state.cells[parentId] = { value: "0", children: [] };
        }
        if (!state.cells[parentId].children) {
          state.cells[parentId].children = [];
        }
        if (!state.cells[parentId].children.includes(id)) {
          state.cells[parentId].children.push(id);
        }
      });

      // 3. Evaluate and update children
      const newValue = evaluateFormula(formula, state.cells);
      state.cells[id].value = newValue;
      
      updateChildren(state, id);
    },
    updateSelected: (state, action) => {
      state.selectedCell = action.payload.id;
      state.selectionRange = { start: action.payload.id, end: action.payload.id };
    },
    selectStart: (state, action) => {
      state.selectedCell = action.payload.id;
      state.selectionRange = { start: action.payload.id, end: action.payload.id };
      state.isSelecting = true;
    },
    selectEnd: (state, action) => {
      if (state.isSelecting) {
        state.selectionRange.end = action.payload.id;
      }
    },
    setIsSelecting: (state, action) => {
      state.isSelecting = action.payload;
    },
    toggleBold: (state) => {
      const targetId = state.selectedCell;
      if (!targetId) return;
      
      const shouldBeBold = !state.cells[targetId]?.isBold;
      
      applyToRange(state, (id) => {
        if (!state.cells[id]) state.cells[id] = {};
        state.cells[id].isBold = shouldBeBold;
      });
    },
    toggleItalic: (state) => {
      const targetId = state.selectedCell;
      if (!targetId) return;

      const shouldBeItalic = !state.cells[targetId]?.isItalic;

      applyToRange(state, (id) => {
        if (!state.cells[id]) state.cells[id] = {};
        state.cells[id].isItalic = shouldBeItalic;
      });
    },
    switchAlignment: (state, action) => {
      const { val } = action.payload;
      applyToRange(state, (id) => {
        if (!state.cells[id]) state.cells[id] = {};
        state.cells[id].align = val;
      });
    },
    setFontFamily: (state, action) => {
      const { fontFamily } = action.payload;
      applyToRange(state, (id) => {
        if (!state.cells[id]) state.cells[id] = {};
        state.cells[id].fontFamily = fontFamily;
      });
    },
    setFontSize: (state, action) => {
      const { fontSize } = action.payload;
      applyToRange(state, (id) => {
        if (!state.cells[id]) state.cells[id] = {};
        state.cells[id].fontSize = fontSize;
      });
    },
    changeFontColor: (state, action) => {
      const { fontColor } = action.payload;
      applyToRange(state, (id) => {
        if (!state.cells[id]) state.cells[id] = {};
        state.cells[id].fontColor = fontColor;
      });
    },
    changeBgColor: (state, action) => {
      const { bgColor } = action.payload;
      applyToRange(state, (id) => {
        if (!state.cells[id]) state.cells[id] = {};
        state.cells[id].bgColor = bgColor;
      });
    },
    clearFormatting: (state) => {
      applyToRange(state, (id) => {
        if (state.cells[id]) {
          const { value, formula, parent, children } = state.cells[id];
          // Keep data but reset styles
          state.cells[id] = { value, formula, parent, children };
        }
      });
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
} = cellsSlice.actions;

// Helper functions for the slice (internal)

function extractParents(formula) {
  // Matches A1, B12, AA100 etc.
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

function updateChildren(state, parentId) {
  const children = state.cells[parentId]?.children;
  if (!children) return;

  children.forEach(childId => {
    const childCell = state.cells[childId];
    if (childCell && childCell.formula) {
      const newValue = evaluateFormula(childCell.formula, state.cells);
      state.cells[childId].value = newValue;
      updateChildren(state, childId);
    }
  });
}

function removeFormula(state, id) {
  const cell = state.cells[id];
  if (!cell || !cell.parent) return;

  cell.parent.forEach(parentId => {
    const parent = state.cells[parentId];
    if (parent && parent.children) {
      parent.children = parent.children.filter(childId => childId !== id);
    }
  });

  state.cells[id].parent = [];
  state.cells[id].formula = "";
}

function isCyclePresent(state, cellId, parents) {
  for (let parentId of parents) {
    if (parentId === cellId) return true;
    // Check if cellId is already an ancestor of parentId (i.e. parentId is reachable from cellId)
    if (isReachable(state, cellId, parentId)) return true;
  }
  return false;
}

function isReachable(state, sourceId, targetId) {
  // Can we reach targetId from sourceId using children links?
  const children = state.cells[sourceId]?.children || [];
  for (let childId of children) {
    if (childId === targetId) return true;
    if (isReachable(state, childId, targetId)) return true;
  }
  return false;
}

export default cellsSlice.reducer;
