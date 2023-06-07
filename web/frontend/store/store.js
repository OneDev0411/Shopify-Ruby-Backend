import { configureStore } from '@reduxjs/toolkit';
import shopAndHost from './reducers/shopAndHost';

export const store = configureStore({
	reducer: {
		shopAndHost: shopAndHost,
	},
});

export default store;