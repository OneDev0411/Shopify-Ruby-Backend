import { createSlice } from '@reduxjs/toolkit';

export const subscriptionPaidStatusSlice = createSlice({
  name: 'subscriptionPaidStatus',
  initialState: {
    isSubscriptionUnpaid: null,
  },
  reducers: {
    setIsSubscriptionUnpaid: (state, action) => {
      state.isSubscriptionUnpaid = action.payload;
    },
  },
});

export const { setIsSubscriptionUnpaid } = subscriptionPaidStatusSlice.actions;

export const selectIsSubscriptionUnpaid = (state) =>
  state.subscriptionPaidStatus.isSubscriptionUnpaid;

export default subscriptionPaidStatusSlice.reducer;