import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  token: "",
  isLoggedIn: false,
  loading: false,
  error: "",
  message: "",
};

export const createRoom = createAsyncThunk("createRoom", async (body) => {
  try {
    const token = localStorage.getItem("livequizAuthToken");
    // Set the Authorization header with the token
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.post(`http://localhost:8020/room/create`, body, {
      headers,
    });
    //console.log("this is res.data of createRoom ", res.data);

    return res.data;
  } catch (err) {
    console.log("error while login ", err);

    return err.response.data;
  }
});

const createRoomSlice = createSlice({
  name: "createRoom",
  initialState,
  reducers: {},
  extraReducers: {
    [createRoom.pending]: (state, action) => {
      state.loading = true;
    },

    [createRoom.fulfilled]: (
      state,

      { payload }
    ) => {
      state.loading = false;
      if (payload?.error) {
        state.error = payload?.error;
      } else {
        state.token = payload.token;
        state.message = payload.message;
        state.isLoggedIn = true;
      }
    },

    [createRoom.rejected]: (state, action) => {
      state.error = action?.payload?.error;
      state.message = action?.payload?.message;
    },
  },
});

export default createRoomSlice.reducer;
