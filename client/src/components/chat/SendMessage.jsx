/* eslint-disable react/prop-types */
import { useState } from "react";
// import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";
import useGetEmotionMessage from "../../hooks/useGetEmotionMessage";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
let countEmotionDetectTime = 1;
const SendMessage = ({
  onUploadChatImage,
  images,
  onCleanChatImageHandler,
  emotionPermissionAllowed,
}) => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { getEmotionMessage } = useGetEmotionMessage();

  const [emojie, setEmojie] = useState(true);
  // useListenMessages();

  const detectEmotion = async () => {
    if (emotionPermissionAllowed && countEmotionDetectTime % 5 === 0) {
      await getEmotionMessage();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!message) return;
    await sendMessage(message, images);
    setMessage("");
    onCleanChatImageHandler();
    countEmotionDetectTime++;
    detectEmotion();
  };

  const handelEmojieSubmit = async (e) => {
    e.preventDefault();
    if (!emojie) return;
  };

  return (
    <div className="chat-input">
      <form action="" onSubmit={handleSubmit}>
        <div className="input-chat-file-container">
          <input
            type="file"
            name="avatar"
            className="input-chat-file"
            accept="image/*"
            onChange={onUploadChatImage}
            multiple
          />
          <i className="fas fa-camera" style={{ marginTop: "3px" }} />
        </div>
        <button onClick={handelEmojieSubmit} className="emoji-picker-button">
          <i
            className="far fa-laugh-beam emoji-picker-icon"
            onClick={() => setEmojie(!emojie)}
          ></i>
        </button>

        <input
          type="text"
          placeholder="Type your message here!"
          value={message}
          className="input-chat-message"
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* {loading ? (
          <span className="loader-small loader-chat-input"></span>
        ) : ( 
          <button className="send-message-button">
           <i className="fas fa-paper-plane" type="submit"></i>
           </button>
         
        {/* )} */}
        <Button
          variant="outlined"
          type="submit"
          disabled={loading}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </form>
      {/* {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{ width: "100%" }}
          />
        </div>
      )} */}
      {!emojie ? (
        <div className="maria">
          <EmojiPicker
            open={!emojie}
            emojiStyle="google"
            onEmojiClick={(e) => setMessage((input) => input + e.emoji)}
            theme="dark"
            className="emoji-picker-container"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SendMessage;
