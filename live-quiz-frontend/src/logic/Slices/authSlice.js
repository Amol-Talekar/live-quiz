import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  token: "",
  isLoggedIn: false,
  loading: false,
  error: "",
  message: "",
};

export const applyAuth = createAsyncThunk("applyAuth", async (body) => {
  try {
    const res = await axios.post(`http://localhost:8020/user/login`, body);
    //console.log("this is res.data of applyAuth ", res.data);
    localStorage.setItem("livequizAuthToken", res.data.token);
    return res.data;
  } catch (err) {
    console.log("error while login ", err);

    return err.response.data;
  }
});

const authSlice = createSlice({
  name: "applyAuth",
  initialState,
  reducers: {
    addToken: (state, action) => {
      state.token = localStorage.getItem("livequizAuthToken") || "";
    },
    logOut: (state, action) => {
      state.token = "";
      localStorage.removeItem("livequizAuthToken");
      state.message = "Logged out succesfully";
      // localStorage.setItem("livequizAuthToken", null);
    },
  },
  extraReducers: {
    [applyAuth.pending]: (state, action) => {
      state.loading = true;
    },

    [applyAuth.fulfilled]: (
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
        // console.log("payload in applyAuth fullfilled ", payload);

        // console.log("state.token  in extraReducer ", state.token);
      }
    },

    [applyAuth.rejected]: (state, action) => {
      state.error = action?.payload?.error;
      state.message = action?.payload?.message;
    },
  },
});

export const { addToken, logOut } = authSlice.actions;

export default authSlice.reducer;
