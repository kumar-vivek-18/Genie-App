// store.js
import { configureStore } from '@reduxjs/toolkit';
import userDataSlice from './reducers/userDataSlice';
import userRequestsSlice from './reducers/userRequestsSlice';
import categorySlice from './reducers/categorySlice';


// Importing the correct reducer from counterSlice.js

const store = configureStore({
  reducer: {
    user: userDataSlice, // Setting the reducer for 'storeData' slice
    userRequest: userRequestsSlice,
    categories:categorySlice
    
  
    // Add other reducers if needed
  }
});

export default store;