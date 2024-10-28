import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPostError,
  clearPostMessage,
  createPost,
} from "../../store/actions/postActions";
import { userLoad } from "../../store/actions/userActions";

import "./NewPost.css";

const NewPost = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.post);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createPost({ image, caption }));
    dispatch(userLoad());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearPostError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearPostMessage());
    }
  }, [dispatch, error, message]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h3">New Post</Typography>

        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
