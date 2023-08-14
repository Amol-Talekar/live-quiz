import { configureStore } from "@reduxjs/toolkit";
import getAllQuestionsSlice from "./Slices/getAllQuestionsSlice";
import authSlice from "./Slices/authSlice";
import getRoomsSlice from "./Slices/getRoomsSlice";
import createRoomSlice from "./Slices/createRoomSlice";
import getSingleRoomSlice from "./Slices/getSingleRoomSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    allProducts: getAllQuestionsSlice,
    allRooms: getRoomsSlice,
    makeRoom: createRoomSlice,
    singleRoom: getSingleRoomSlice,
  },
});
