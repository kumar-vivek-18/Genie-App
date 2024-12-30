import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categoryImages: {},
  },
  reducers: {
    setCategoryImages: (state, action) => {
      const { categoryName, images } = action.payload;
      state.categoryImages[categoryName] = images;
    },
    addCategoryImages: (state, action) => {
      const { categoryName, images } = action.payload;
      if (!state.categoryImages[categoryName]) {
        state.categoryImages[categoryName] = [];
      }
      state.categoryImages[categoryName] = [
        ...state.categoryImages[categoryName],
        ...images,
      ];
    },
  },
});

export const { setCategoryImages, addCategoryImages } = categorySlice.actions;

export default categorySlice.reducer;
