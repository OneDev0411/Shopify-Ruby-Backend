import {createSlice} from '@reduxjs/toolkit';
const params = new URLSearchParams(window.location.search);
const initialState = {
  shop: params.get('shop'),
  host: params.get('host'),
};

export const shopAndHostSlice = createSlice({
	name: 'StoreShopAndHost',
	initialState,

	reducers: {
		setShopAndHost: (state, action) => {
			state.shop = action.payload.shop
      state.host = action.payload.host
		},
	},
});

export const {
	setShopAndHost,
} = shopAndHostSlice.actions;

export const getShop = (state) => state.shop;
export const getHost = (state) => state.host;

export default shopAndHostSlice.reducer;