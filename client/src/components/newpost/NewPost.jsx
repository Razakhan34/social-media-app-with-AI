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
import axios from "axios";
import configuration from "../../config/configuration";

const NewPost = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.post);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [captionImage, setCaptionImage] = useState("");
  const [isCaptionLoading, setCaptionLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCaptionImage(file);

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const handleGenerateCaption = async () => {
    // Example logic - replace with your API or logic to generate captions
    const formData = new FormData();
    formData.append("image", captionImage);
    setCaptionLoading(true);
    try {
      const response = await axios.post(
        `${configuration.flaskBaseUrl}/generate-caption/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCaption(response.data.caption);
      console.log("Response:", response.data);
      setCaptionLoading(false);
      // alert("Image uploaded successfully!");
    } catch (error) {
      setCaptionLoading(false);
      console.error("Error uploading image:", error);
    }
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
        <div className="captionInputContainer">
          <textarea
            name=""
            id=""
            className="caption_textarea"
            placeholder="Caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>

          {isCaptionLoading && (
            <span className="loading-text">
              Generating<span className="dots">...</span>
            </span>
          )}
          {!isCaptionLoading && (
            <span
              className="generate-caption-link"
              onClick={handleGenerateCaption}
            >
              Generate Caption
            </span>
          )}
        </div>
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
