import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  status: "",
  QuestionsData: [],
  loading: false,
  error: "",
  message: "",
};

export const getAllQuestions = createAsyncThunk(
  "getAllQuestions",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(`http://localhost:8020/questions`);
      console.log("res.data ==> ", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const getAllQuestionsSlice = createSlice({
  name: "getAllQuestions",
  initialState,
  reducers: {},

  extraReducers: {
    [getAllQuestions.pending]: (state, action) => {
      state.loading = true;

      state.error = "";
    },

    [getAllQuestions.fulfilled]: (
      state,

      { payload, error }
    ) => {
      state.loading = false;
      if (error) {
        state.error = error;
      } else {
        state.QuestionsData = payload;
      }
    },

    [getAllQuestions.rejected]: (
      state,
      //@ts-ignore
      { payload: { message, error } }
    ) => {
      state.error = error;
      state.loading = false;
    },
  },
});

export default getAllQuestionsSlice.reducer;
