import { Link, useParams } from "react-router-dom";
import "./CommentCard.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMyPosts,
  getAllPostOfUser,
  postCommentDelete,
} from "../../store/actions/postActions";
import { getPostsOfFollowing } from "../../store/actions/userActions";

const CommentCard = ({
  userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  isAccount,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { userID: userProfileId } = useParams();
  const deleteCommentHandler = async () => {
    await dispatch(postCommentDelete(postId, commentId));

    if (userProfileId) {
      dispatch(getAllPostOfUser(userProfileId));
    } else if (isAccount) {
      dispatch(getAllMyPosts());
    } else {
      dispatch(getPostsOfFollowing());
    }
  };

  return (
    <div className="comment">
      <img src={avatar} alt={name} className="profile-pic" />
      <div className="comment-details">
        <div className="name-actions">
          <Link to={`/user/${userId}`}>
            <h3 className="name">{name}</h3>{" "}
          </Link>
          {isAccount ? (
            <div className="comment-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn" onClick={deleteCommentHandler}>
                Delete
              </button>
            </div>
          ) : userId === user._id ? (
            <div className="comment-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn" onClick={deleteCommentHandler}>
                Delete
              </button>
            </div>
          ) : null}
        </div>
        <p className="comment-text">{comment}</p>
      </div>
    </div>
  );
};

export default CommentCard;
