import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    requestDetail: "",
    requestCategory: null,
    requestImages: [],
    expectedPrice: 0,
    spadePrice: 20,
    createdRequest: [],
    history: [],

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
            state.requestImages.push(action.payload);
        },
        setExpectedPrice: (state, action) => {
            state.expectedPrice = action.payload;
        },
        setCreatedRequest: (state, action) => {
            state.createdRequest = action.payload;
        },
        setHistory: (state, action) => {
            state.history = action.payload;
        },
        emtpyRequestImages: (state, action) => {
            state.requestImages = [];
        },
        setSpadePrice: (state, action) => {
            state.requestPrice = action.payload;
        },

    },
});

export const { setRequestDetail, setRequestCategory, setRequestImages, setExpectedPrice, setCreatedRequest, setHistory, emtpyRequestImages, setSpadePrice } = userRequestDataSlice.actions;
export default userRequestDataSlice.reducer;