import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { TBSlice } from './Reducers/TBSlice';

// Root reducer
const main = combineReducers({
  TB: TBSlice.reducer,
});

// Configure store
const store = configureStore({
  reducer: {
    main,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
