import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {},
  reducers: {
    postRequest(state) {
      state.loading = true;
    },
    likeSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    commentSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    commentDeleteSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    newPostSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    deletePostSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    followAndUnFollowSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updateCaptionSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    postFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
});
export const postActions = postSlice.actions;

export const myPostSlice = createSlice({
  name: "myPost",
  initialState: {},
  reducers: {
    myPostRequest(state) {
      state.loading = true;
    },
    myPostSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload;
    },

    myPostFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});
export const myPostActions = myPostSlice.actions;

export const userPostSlice = createSlice({
  name: "userPost",
  initialState: {},
  reducers: {
    userPostRequest(state) {
      state.loading = true;
    },
    userPostSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload;
    },

    userPostFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});
export const userPostActions = userPostSlice.actions;
