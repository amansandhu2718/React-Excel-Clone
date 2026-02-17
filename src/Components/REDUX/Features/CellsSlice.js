import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCell: "",
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
export const cellsSlice = createSlice({
  name: "sheet",
  initialState,
  reducers: {
    addValue: (state, action) => {
      const { id, value } = action.payload;
      if (id == null) return;
      // This only updates one key
      state.cells[id] = { ...state.cells[id], value };
    },
    updateSelected: (state, action) => {
      state.selectedCell = action.payload.id;
    },
    toggleBold: (state, action) => {
      const { id } = action.payload;
      // console.log("toggle id : " + id);
      if (id == null) return;
      if (state.cells[id] == null) {
        state.cells[id] = {};
      }
      state.cells[id].isBold = state.cells[id]?.isBold ? false : true;
    },
    toggleItalic: (state, action) => {
      const { id } = action.payload;
      // console.log("toggle id : " + id);
      if (id == null) return;
      if (state.cells[id] == null) {
        state.cells[id] = {};
      }
      state.cells[id].isItalic = state.cells[id]?.isItalic ? false : true;
    },
    switchAlignment: (state, action) => {
      const { id, val } = action.payload;
      if (id == null) return;
      if (state.cells[id] == null) {
        state.cells[id] = {};
      }
      state.cells[id].align = val;
    },
    setFontFamily: (state, action) => {
      const { id, fontFamily } = action.payload;
      if (id == null) return;
      if (state.cells[id] == null) {
        state.cells[id] = {};
      }
      state.cells[id].fontFamily = fontFamily;
    },
    setFontSize: (state, action) => {
      const { id, fontSize } = action.payload;
      if (id == null) return;
      if (state.cells[id] == null) {
        state.cells[id] = {};
      }
      state.cells[id].fontSize = fontSize;
    },
    changeFontColor() {},
    changeBgColor() {},
  },
});

// Action creators are generated for each case reducer function
export const {
  addValue,
  updateSelected,
  toggleBold,
  toggleItalic,
  switchAlignment,
  setFontFamily,
  setFontSize,
} = cellsSlice.actions;

export default cellsSlice.reducer;
