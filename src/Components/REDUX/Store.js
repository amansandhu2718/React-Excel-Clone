import { configureStore } from "@reduxjs/toolkit";
import cellsReducer from "./Features/CellsSlice";
const store = configureStore({
  reducer: { sheet: cellsReducer },
});

export default store;
