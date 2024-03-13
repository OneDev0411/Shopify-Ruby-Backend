import { configureStore } from '@reduxjs/toolkit';
import shopAndHost from './reducers/shopAndHost';
import subscriptionPaidStatusSlice from './reducers/subscriptionPaidStatusSlice';
import abTestBannerPageSlice from './reducers/abTestBannerPage';

export const store = configureStore({
	reducer: {
		shopAndHost: shopAndHost,
		subscriptionPaidStatus: subscriptionPaidStatusSlice,
		abTestBannerPage: abTestBannerPageSlice,
	},
});

export default store;