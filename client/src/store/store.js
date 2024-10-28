import { configureStore } from "@reduxjs/toolkit";
import { myPostSlice, postSlice, userPostSlice } from "./slices/postSlices";
import {
  allUsersInMainSlice,
  allUsersSlice,
  postsOfFollowingSlice,
  userFeatureSlice,
  userProfileSlice,
  userSlice,
} from "./slices/userSlices";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    userFeature: userFeatureSlice.reducer,
    postOfFollowing: postsOfFollowingSlice.reducer,
    allUser: allUsersSlice.reducer,
    allUsersInMain: allUsersInMainSlice.reducer,
    post: postSlice.reducer,
    myPost: myPostSlice.reducer,
    userPost: userPostSlice.reducer,
    userProfile: userProfileSlice.reducer,
  },
});

export default store;
