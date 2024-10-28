/* eslint-disable react/prop-types */
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";

import ChatIcon from "@mui/icons-material/Chat";

import reviews_on_emotions from "./reviews_based_on_emotions.js";

import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPostError,
  clearPostMessage,
  deletePost,
  getAllMyPosts,
  getAllPostOfUser,
  postComment,
  postLikeAndDislike,
  updateCaption,
} from "../../store/actions/postActions.js";
import {
  getPostsOfFollowing,
  userLoad,
} from "../../store/actions/userActions.js";
import User from "../user/User.jsx";
import CommentCard from "../commentCard/CommentCard.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import useConversation from "../../zhustand/useConversation.js";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  owner,
  isDelete = false,
  isAccount = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userID: userProfileId } = useParams();
  const { user } = useSelector((state) => state.user);
  const { error, message } = useSelector((state) => state.myPost);

  const [liked, setLiked] = useState(false);
  const [startGenerating, setStartGenerating] = useState(false);
  const [emotionLoading, setEmotionLoading] = useState(false);
  const [openLikeUser, setOpenLikeUser] = useState(false);
  const [commentToggle, setCommentToggle] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [captionToggle, setCaptionToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);
  const { selectedConversation, setSelectedConversation } = useConversation();

  const handleLike = async () => {
    setLiked((prev) => !prev);
    await dispatch(postLikeAndDislike(postId));
    if (userProfileId) {
      dispatch(getAllPostOfUser(userProfileId));
    } else if (isAccount) {
      dispatch(getAllMyPosts());
    } else {
      dispatch(getPostsOfFollowing());
    }
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(postComment(postId, commentValue));
    if (userProfileId) {
      dispatch(getAllPostOfUser(userProfileId));
    } else if (isAccount) {
      dispatch(getAllMyPosts());
    } else {
      dispatch(getPostsOfFollowing());
    }
  };

  const deletePostHandler = async () => {
    await dispatch(deletePost(postId));
    dispatch(getAllMyPosts());
    dispatch(userLoad());
  };

  const updateCaptionHandler = async (e) => {
    e.preventDefault();
    await dispatch(updateCaption(postId, captionValue));
    dispatch(getAllMyPosts());
  };

  const commentHandler = () => {
    setCommentToggle((prev) => !prev);
  };

  const chatHandlerPost = () => {
    setSelectedConversation(owner);
  };
  useEffect(() => {
    if (selectedConversation) {
      navigate("/chat");
    }
  }, [navigate, selectedConversation]);
  useEffect(() => {
    const fetchData = async () => {
      setEmotionLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/emotion_detect"
        );
        // setEmotions(response.data.emotions);
        const emotions = response.data.emotions;
        const suggest_review_arr =
          reviews_on_emotions[emotions[emotions.length - 1]];
        const suggest_review =
          suggest_review_arr[Math.floor(Math.random() * 4)];
        setCommentValue(suggest_review);
        setStartGenerating(false);
        setEmotionLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEmotionLoading(false);
      }
    };
    if (commentToggle && startGenerating) {
      fetchData();
    }
  }, [commentToggle, startGenerating]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearPostMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearPostError());
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    likes.forEach((like) => {
      if (like._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

  return (
    <div className="post">
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
          }}
        />
        <div className="user-name-image-container">
          <Link to={`/user/${ownerId}`}>
            <Typography fontWeight={700}>{ownerName}</Typography>
          </Link>
          <p>Mumbai</p>
        </div>
      </div>
      {/* <div className="postHeader">
        {isAccount ? (
          <Button onClick={() => setCaptionToggle(!captionToggle)}>
            <MoreVert />
          </Button>
        ) : null}
      </div> */}

      <img src={postImage} alt="Post" />

      <Typography
        fontWeight={100}
        color="rgba(0, 0, 0, 0.582)"
        style={{ alignSelf: "center", margin: "0.6vmax 0vmax" }}
      >
        {caption}
      </Typography>

      <button
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 0vmax",
        }}
        onClick={() => setOpenLikeUser((prev) => !prev)}
        disabled={likes.length === 0 ? true : false}
      >
        <Typography>{likes.length} Likes</Typography>
      </button>

      <div className="postFooter">
        <Button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </Button>

        <Button onClick={commentHandler}>
          <ChatBubbleOutline />
        </Button>

        <Button onClick={chatHandlerPost}>
          <ChatIcon />
        </Button>

        {isDelete ? (
          <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
      </div>

      <Dialog
        open={openLikeUser}
        onClose={() => setOpenLikeUser((prev) => !prev)}
      >
        <div className="DialogBox">
          <Typography variant="h6">Liked By</Typography>

          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url}
            />
          ))}
        </div>
      </Dialog>

      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle((prev) => !prev)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>

          <div className="comments-container">
            <div className="comment-form">
              <form onSubmit={addCommentHandler}>
                <div className="textarea-container">
                  <textarea
                    placeholder="Write your comment here..."
                    rows="4"
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                  ></textarea>
                  <button
                    type="button"
                    className={`generate-button ${
                      emotionLoading ? "disabled" : ""
                    }`}
                    disabled={emotionLoading}
                    onClick={() => setStartGenerating(true)}
                  >
                    Generate
                  </button>
                </div>
                <button type="submit" className="submit-button">
                  Post Comment
                </button>
              </form>
            </div>

            {comments && comments.length > 0 ? (
              comments.map((item) => (
                <CommentCard
                  userId={item.user._id}
                  name={item.user.name}
                  avatar={item.user.avatar.url}
                  comment={item.comment}
                  commentId={item._id}
                  key={item._id}
                  postId={postId}
                  isAccount={isAccount}
                />
              ))
            ) : (
              <Typography>No comments Yet</Typography>
            )}
          </div>
        </div>
      </Dialog>

      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update Caption</Typography>

          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required
            />
            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Post;
