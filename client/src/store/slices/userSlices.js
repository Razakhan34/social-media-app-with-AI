import { createSlice } from "@reduxjs/toolkit";

const userInitialState = {
  isAuthenticated: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    userRequest(state) {
      state.loading = true;
    },
    loginSucess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loadSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    deleteUserSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = true;
    },
    userFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    clearUserError(state) {
      state.error = null;
    },
  },
});
export const userActions = userSlice.actions;

export const postsOfFollowingSlice = createSlice({
  name: "postsOfFollowing",
  initialState: {},
  reducers: {
    postOfFollowinRequest(state) {
      state.loading = true;
    },
    postOfFollowinSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload;
    },
    postOfFollowinFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});
export const postsOfFollowingActions = postsOfFollowingSlice.actions;

export const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: {},
  reducers: {
    allUsersRequest(state) {
      state.loading = true;
    },
    allUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    allUsersFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const allUsersActions = allUsersSlice.actions;

export const allUsersInMainSlice = createSlice({
  name: "allUsersInMain",
  initialState: {},
  reducers: {
    allUsersInMainRequest(state) {
      state.loading = true;
    },
    allUsersInMainSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    allUsersInMainFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const allUsersInMainActions = allUsersInMainSlice.actions;

export const userFeatureSlice = createSlice({
  name: "userFeature",
  initialState: {},
  reducers: {
    userFeatureRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    userFeatureFail(state, action) {
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
export const userFeatureActions = userFeatureSlice.actions;

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {},
  reducers: {
    userProfileRequest(state) {
      state.loading = true;
    },
    userProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    userProfileFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});
export const userProfileActions = userProfileSlice.actions;
