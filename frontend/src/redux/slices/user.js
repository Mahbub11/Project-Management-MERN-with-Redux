// import { showSnackbar } from "./app";
import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { API_LEVEL } from "../../config";
import { ShowsnackBar } from "../actions";
import { userData } from "./userFunction";
// import { ShowsnackBar } from "../actions";
// import { showSnackbar } from "./app";
// import { showSnackbar } from "./app";

const initialState = {
  loading: true,
  error: null,
  message: null,
};

const slice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    // LoadUserRequest: (state) => {
    //   state.loading = true;
    // },
  },
});

// export the slice of reducer
export default slice.reducer;
