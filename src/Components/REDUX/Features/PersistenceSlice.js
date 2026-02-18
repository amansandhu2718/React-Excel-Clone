import { createSlice } from "@reduxjs/toolkit";

const persistenceSlice = createSlice({
  name: "persistence",
  initialState: {
    status: "saved", // 'saved' | 'saving' | 'idle'
  },
  reducers: {
    setSaving: (state) => {
      state.status = "saving";
    },
    setSaved: (state) => {
      state.status = "saved";
    },
    setIdle: (state) => {
      state.status = "idle";
    },
  },
});

export const { setSaving, setSaved, setIdle } = persistenceSlice.actions;
export default persistenceSlice.reducer;
