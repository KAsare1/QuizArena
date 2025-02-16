import { configureStore } from '@reduxjs/toolkit';
import transitionReducer from './transitionSlice';

const store = configureStore({
  reducer: {
    transition: transitionReducer,
  },
});

export default store;
