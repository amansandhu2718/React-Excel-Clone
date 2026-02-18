import { configureStore } from "@reduxjs/toolkit";
import cellsReducer from "./Features/CellsSlice";
import authReducer from "./Features/AuthSlice";
import persistenceReducer from "./Features/PersistenceSlice";

const store = configureStore({
  reducer: { 
    sheet: cellsReducer,
    auth: authReducer,
    persistence: persistenceReducer,
  },
});

export default store;
