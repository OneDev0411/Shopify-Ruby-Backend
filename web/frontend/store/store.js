import { configureStore } from '@reduxjs/toolkit';
import shopAndHost from './reducers/shopAndHost';
import subscriptionPaidStatusSlice from './reducers/subscriptionPaidStatusSlice';

export const store = configureStore({
	reducer: {
		shopAndHost: shopAndHost,
		subscriptionPaidStatus: subscriptionPaidStatusSlice,
	},
});

export default store;