// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
//import adminReducer from "./adminSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    //admin: adminReducer,
    user: userReducer,
  }, 
});

export { store };
