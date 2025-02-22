import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    requestDetail: "",
    requestCategory: null,
    requestImages: [],
    suggestedImages: [],
    expectedPrice: 0,
    spadePrice: 0,
    createdRequest: [],
    spadeCouponCode: "",
    nearByStoresCategory: [],
    estimatedPrice: 0,
    isService: false
};

const userRequestDataSlice = createSlice({
    name: 'userRequest',
    initialState,
    reducers: {
        setRequestDetail: (state, action) => {
            state.requestDetail = action.payload;
        },
        setRequestCategory: (state, action) => {
            state.requestCategory = action.payload;
        },

        setRequestImages: (state, action) => {
            state.requestImages=action.payload;
        },
        setExpectedPrice: (state, action) => {
            state.expectedPrice = action.payload;
        },
        setCreatedRequest: (state, action) => {
            state.createdRequest = action.payload;
        },
        emtpyRequestImages: (state, action) => {
            state.requestImages = [];
        },
        setSpadePrice: (state, action) => {
            state.spadePrice = action.payload;
        },
        setSpadeCouponCode: (state, action) => {
            state.spadeCouponCode = action.payload;
        },
        requestClear: (state) => {
            return initialState;
        },
        setNearByStoresCategory: (state, action) => {
            state.nearByStoresCategory = action.payload;
        },
        setSuggestedImages: (state, action) => {
            state.suggestedImages = action.payload;
        },
        setEstimatedPrice: (state, action) => {
            state.estimatedPrice = action.payload;
        },
        setIsService: (state, action) => {
            state.isService = action.payload;
        }
    },
});

export const { setRequestDetail, setRequestCategory,setIsService, setRequestImages, setExpectedPrice, setCreatedRequest, emtpyRequestImages, setSpadePrice, setSpadeCouponCode, requestClear, setNearByStoresCategory, setSuggestedImages, setEstimatedPrice } = userRequestDataSlice.actions;
export default userRequestDataSlice.reducer;