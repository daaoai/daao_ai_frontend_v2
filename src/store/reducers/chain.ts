import { AvailableReducerNames } from '@/constants/store';
import { ChainsReducerState } from '@/types/store';
import { createSlice } from '@reduxjs/toolkit';

export const initialState: ChainsReducerState = {
  supportedChainsData: [],
};
const chainsReducer = createSlice({
  name: AvailableReducerNames.chains,
  initialState,
  reducers: {
    setSupportedChainsData: (state, action) => {
      state.supportedChainsData = action.payload;
    },
  },
});

export const { setSupportedChainsData } = chainsReducer.actions;

export default chainsReducer.reducer;
