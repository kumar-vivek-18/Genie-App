// features/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileNumber: "",
  userName: "",
  userLocation: "",
  images: [],
  userDetails: {},
  spades: [],
  currentSpade: {},
  currentSpadeRetailer: {},
  currentSpadeRetailers: [],
  currentChatMessages: [],
  uniqueToken: "",
};

const userDataSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setMobileNumber: (state, action) => {
      state.mobileNumber = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setSpades: (state, action) => {
      state.spades = action.payload;
    },
    setCurrentSpade: (state, action) => {
      state.currentSpade = action.payload;
    },
    setCurrentSpadeRetailer: (state, action) => {
      state.currentSpadeRetailer = action.payload;
    },
    setCurrentSpadeRetailers: (state, action) => {
      state.currentSpadeRetailers = action.payload;
    },
    setCurrentChatMessages: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.currentChatMessages = action.payload;
      } else {
        console.error('Non-array value detected in setCurrentChatMessages:', action.payload);
      }
    },
    setUniqueToken: (state, action) => {
      state.uniqueToken = action.payload;
    },
    userClear: (state) => {
      return initialState;
    }
  },
});

export const { setMobileNumber, setUserName, setUserLocation, setImages, setUserDetails, setSpades, setCurrentSpade, setCurrentSpadeRetailer, setCurrentSpadeRetailers, setCurrentChatMessages, setUniqueToken,userClear } = userDataSlice.actions;
export default userDataSlice.reducer;