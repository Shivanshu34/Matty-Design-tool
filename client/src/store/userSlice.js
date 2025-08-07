import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'user',
  initialState: { token: null, user: null },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = slice.actions;
export default slice.reducer;
