import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { setLocalItems } from "../utils/utils";

interface counterState {
  count: number;
}

const initialState: counterState = { count: 0 } as const;

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state, action: PayloadAction<number>) {
      action.payload ? (state.count += action.payload) : state.count++;
      setLocalItems("count", state.count);
    },
    decrement(state, action: PayloadAction<number>) {
      action.payload ? (state.count -= action.payload) : state.count--;
      setLocalItems("count", state.count);
    },
    reset(state) {
      state.count = 0;
      setLocalItems("count", state.count);
    },
    setDefaultValue(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
});

export const counterActions = counterSlice.actions;
export default counterSlice.reducer;
