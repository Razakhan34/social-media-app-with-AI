import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearPostError,
  clearPostMessage,
  clearUserPostError,
  getAllPostOfUser,
} from "../../store/actions/postActions";
import {
  clearUserProfileError,
  followAndUnfollowUser,
  getUserProfile,
  userLoad,
} from "../../store/actions/userActions";
import Loader from "../loader/Loader";
import Post from "../post/Post";
import User from "../user/User";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userID } = useParams();

  const { user: LoggedInUser } = useSelector((state) => state.user);
  const {
    loading: userLoading,
    error,
    user,
  } = useSelector((state) => state.userProfile);
  const {
    loading: postLoading,
    error: userPostError,
    posts,
  } = useSelector((state) => state.userPost);

  const { message, error: postError } = useSelector((state) => state.post);

  const [myProfile, setMyProfile] = useState(false);
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);

  const followHandler = async () => {
    // setFollowing(!following);
    await dispatch(followAndUnfollowUser(userID));
    dispatch(getUserProfile(userID));
    dispatch(userLoad());
  };

  useEffect(() => {
    dispatch(getUserProfile(userID));
    dispatch(getAllPostOfUser(userID));
  }, [dispatch, userID]);

  useEffect(() => {
    if (userID === LoggedInUser._id) {
      setMyProfile(true);
    }
    if (user) {
      const isFollowing = user.followers.find(
        (follower) => follower._id === LoggedInUser._id
      );
      if (isFollowing) setFollowing(true);
      else setFollowing(false);
      // user.followers.forEach((item) => {
      //   if (item._id === LoggedInUser._id) {
      //     setFollowing(true);
      //   } else {
      //     setFollowing(false);
      //   }
      // });
    }
  }, [userID, LoggedInUser, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserProfileError());
    }
    if (userPostError) {
      toast.error(userPostError);
      dispatch(clearUserPostError());
    }
    if (postError) {
      toast.error(postError);
      dispatch(clearPostError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearPostMessage());
    }
  }, [dispatch, error, userPostError, message, postError]);

  return userLoading || postLoading ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
            />
          ))
        ) : (
          <Typography variant="h6">User has not created any post</Typography>
        )}
      </div>
      <div className="accountright">
        {user && (
          <>
            <Avatar
              src={user.avatar.url}
              sx={{ height: "8vmax", width: "8vmax" }}
            />

            <Typography variant="h5">{user.name}</Typography>

            <div>
              <button onClick={() => setFollowersToggle(!followersToggle)}>
                <Typography>Followers</Typography>
              </button>
              <Typography>{user.followers.length}</Typography>
            </div>

            <div>
              <button onClick={() => setFollowingToggle(!followingToggle)}>
                <Typography>Following</Typography>
              </button>
              <Typography>{user.following.length}</Typography>
            </div>

            <div>
              <Typography>Posts</Typography>
              <Typography>{user.posts.length}</Typography>
            </div>

            {myProfile ? null : (
              <Button
                variant="contained"
                style={{ background: following ? "red" : "" }}
                onClick={followHandler}
                // disabled={followLoading}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}
          </>
        )}
        <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>

            {user && user.followers.length > 0 ? (
              user.followers.map((follower) => (
                <User
                  key={follower._id}
                  userId={follower._id}
                  name={follower.name}
                  avatar={follower.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You have no followers
              </Typography>
            )}
          </div>
        </Dialog>

        <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Following</Typography>

            {user && user.following.length > 0 ? (
              user.following.map((follow) => (
                <User
                  key={follow._id}
                  userId={follow._id}
                  name={follow.name}
                  avatar={follow.avatar.url}
                />
              ))
            ) : (
              <Typography style={{ margin: "2vmax" }}>
                You are not following anyone
              </Typography>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
