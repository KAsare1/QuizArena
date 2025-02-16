import { createSlice } from '@reduxjs/toolkit';

const transitionSlice = createSlice({
  name: 'transition',
  initialState: {
    moving: false,
  },
  reducers: {
    startTransition(state) {
      state.moving = true;
    },
    endTransition(state) {
      state.moving = false;
    },
  },
});

export const { startTransition, endTransition } = transitionSlice.actions;
export default transitionSlice.reducer;
