import { createSlice } from "@reduxjs/toolkit";

export const abTestBannerPageSlice = createSlice({
  name: "abTestBannerPage",
  initialState: {
    page: localStorage.getItem("abTestBannerPage"),
  },
  reducers: {
    setABTestBannerPage: (state, action) => {
      state.page = action.payload;
      localStorage.setItem("abTestBannerPage", action.payload);
    },
  },
});

export const { setABTestBannerPage } = abTestBannerPageSlice.actions;

export const getABTestBannerPage = (state) => state.abTestBannerPage.page;

export default abTestBannerPageSlice.reducer;
