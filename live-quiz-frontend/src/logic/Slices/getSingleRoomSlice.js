import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  singleRoomData: [],
  loading: false,
  error: "",
  message: "",
};

export const getSingleRoom = createAsyncThunk(
  "getSingleRoom",
  async (roomId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("livequizAuthToken");
      // Set the Authorization header with the token
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`http://localhost:8020/room/${roomId}`, {
        headers,
      });
      console.log("res.data ==> ", res.data.room);
      return res.data.room;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const getSingleRoomSlice = createSlice({
  name: "getSingleRoom",
  initialState,
  reducers: {},

  extraReducers: {
    [getSingleRoom.pending]: (state, action) => {
      state.loading = true;

      state.error = "";
    },

    [getSingleRoom.fulfilled]: (
      state,

      { payload, error }
    ) => {
      state.loading = false;
      if (error) {
        state.error = error;
      } else {
        state.singleRoomData = payload;
      }
    },

    [getSingleRoom.rejected]: (
      state,
      //@ts-ignore
      { payload: { message, error } }
    ) => {
      state.error = error;
      state.loading = false;
    },
  },
});

export default getSingleRoomSlice.reducer;
