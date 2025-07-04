import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentComplaintState {
  complaintId: string | null;
}

const initialState: CurrentComplaintState = {
  complaintId: null,
};

const currentComplaintSlice = createSlice({
  name: 'currentComplaint',
  initialState,
  reducers: {
    setCurrentComplaintId: (state, action: PayloadAction<string>) => {
      state.complaintId = action.payload;
    },
    clearCurrentComplaintId: (state) => {
      state.complaintId = null;
    },
  },
});

export const { setCurrentComplaintId, clearCurrentComplaintId } = currentComplaintSlice.actions;
export default currentComplaintSlice.reducer;