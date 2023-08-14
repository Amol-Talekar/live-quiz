import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  roomsData: [],
  loading: false,
  error: "",
  message: "",
};

export const getAllRooms = createAsyncThunk(
  "getAllRooms",
  async (rejectWithValue) => {
    try {
      const token = localStorage.getItem("livequizAuthToken");
      // Set the Authorization header with the token
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`http://localhost:8020/room`, { headers });
      //console.log("res.data ==> ", res.data.rooms);
      return res.data.rooms;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const getAllRoomsSlice = createSlice({
  name: "getAllRooms",
  initialState,
  reducers: {},

  extraReducers: {
    [getAllRooms.pending]: (state, action) => {
      state.loading = true;

      state.error = "";
    },

    [getAllRooms.fulfilled]: (
      state,

      { payload, error }
    ) => {
      state.loading = false;
      if (error) {
        state.error = error;
      } else {
        state.roomsData = payload;
      }
    },

    [getAllRooms.rejected]: (
      state,
      //@ts-ignore
      { payload: { message, error } }
    ) => {
      state.error = error;
      state.loading = false;
    },
  },
});

export default getAllRoomsSlice.reducer;
