// import { showSnackbar } from "./app";
import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { API_LEVEL } from "../../config";
import { ShowsnackBar } from "../actions";
import { TaskData, userData } from "./taskFunction";
// import { ShowsnackBar } from "../actions";
// import { showSnackbar } from "./app";
// import { showSnackbar } from "./app";

const initialState = {
  loading: true,
  error: null,
  message: null,
  tasks: [],
};
const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    LoadProjectRequest: (state) => {
      state.loading = true;
    },
    LoadProjectSuccess: (state, action) => {
      state.loading = false;
      state.tasks = action.payload.payload;
    },
    LoadProjectFail: (state, action) => {
      state.loading = false;
      state.error = action.payload.payload;
    },
    LoadDraggedResult: (state, action) => {
      state.loading = false;
      // console.log(action.payload)
      // const data=TaskData(action.payload.payload,state.tasks)
      state.tasks = [...state.tasks];
    },
  },
});

// export the slice of reducer
export default slice.reducer;

export const FetchAllProject = () => async (dispatch) => {
  try {
    dispatch(slice.actions.LoadProjectRequest());
    await axios
      .get(`/all-projects`, {})
      .then(function (response) {
        // console.log(response)
        dispatch(
          slice.actions.LoadProjectSuccess({
            payload: response.data,
          })
        );

        // dispatch( ShowsnackBar({ severity: "success", message: response.data.message}))
      })
      .catch(function (error) {
        dispatch({
          type: "LoadProjectFail",
          payload: error,
        });
        // dispatch( ShowsnackBar({ severity: "error", message: error.message }))
      });
  } catch (error) {
    dispatch(
      slice.actions.LoadProjectFail({
        payload: error,
      })
    );
    // dispatch( ShowsnackBar({ severity: "error", message: error.message }))

    console.log(error);
  }
};

export const SaveDragged = (data,projectId) => async (dispatch) => {
  try {

    let todo = []
    for(const key in data){
      for(const index in data[key].items){
        var myObject = new String(data[key].items[index].stage);
        myObject=data[key].name
        todo.push({_id:projectId, taskId: data[key].items[index]._id, stage: myObject, order: index })
      }
    }
 
    dispatch(
      slice.actions.LoadDraggedResult({
        payload: todo,
      })
    );
  } catch (error) {
    dispatch(
      slice.actions.LoadProjectFail({
        payload: error,
      })
    );
    // dispatch( ShowsnackBar({ severity: "error", message: error.message }))

    console.log(error);
  }
};
