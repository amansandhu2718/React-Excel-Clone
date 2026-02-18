import { configureStore } from "@reduxjs/toolkit";
import cellsReducer from "./Features/CellsSlice";
import authReducer from "./Features/AuthSlice";

const store = configureStore({
  reducer: { 
    sheet: cellsReducer,
    auth: authReducer,
  },
});

export default store;
