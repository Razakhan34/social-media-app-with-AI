/* eslint-disable react/prop-types */
import { useState } from "react";
// import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";
import useGetEmotionMessage from "../../hooks/useGetEmotionMessage";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import configuration from "../../config/configuration";
import { toast } from "react-toastify";
import useGetMessages from "../../hooks/useGetMessages";
import { useSelector } from "react-redux";
let countEmotionDetectTime = 1;
const SendMessage = ({
  onUploadChatImage,
  images,
  onCleanChatImageHandler,
  emotionPermissionAllowed,
  selectedUser,
}) => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { getEmotionMessage } = useGetEmotionMessage();
  const [emojie, setEmojie] = useState(true);
  const [motivizeLoading, setMotivizeLoading] = useState(false);
  const { messages } = useGetMessages();
  const { user } = useSelector((state) => state.user);
  // useListenMessages();

  const getMotivationalMessage = async () => {
    const name = selectedUser.name;
    const emotion = messages[messages.length - 1].emotionPrediction;
    setMotivizeLoading(true);
    // Set loading true here (if you're using a state for it)

    try {
      const res = await fetch(
        `${configuration.flaskBaseUrl}/motivational-message`, // ✅ correct the URL spelling
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, emotion }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Something went wrong");
      }

      // ✅ No need to parse again if it's already a string
      const newMotivationalMessage = data.message;
      setMessage(newMotivationalMessage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setMotivizeLoading(false);
    }
  };

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
      <form
        action=""
        onSubmit={handleSubmit}
        className="inputs-message-main-container"
      >
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

        {/* <input
          type="text"
          placeholder="Type your message here!"
          value={message}
          className="input-chat-message"
          onChange={(e) => setMessage(e.target.value)}
        /> */}
        <textarea
          placeholder="Type your message here!"
          value={message}
          className="input-chat-message-field"
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          style={{
            resize: "none",
            overflowY: "auto", // allow vertical scroll when needed
            maxHeight: "150px", // limit how much it can grow
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />

        {/* {loading ? (
          <span className="loader-small loader-chat-input"></span>
        ) : ( 
          <button className="send-message-button">
           <i className="fas fa-paper-plane" type="submit"></i>
           </button>
         
        {/* )} */}
        <div className="input-send-buttons-container">
          {messages.length > 0 &&
            user._id !== messages[messages.length - 1].senderId &&
            messages[messages.length - 1].emotionPrediction && (
              <Button
                variant="outlined"
                style={{ marginRight: "10px" }}
                type="button"
                endIcon={<SendIcon />}
                onClick={getMotivationalMessage}
                disabled={motivizeLoading}
              >
                {motivizeLoading ? "Generating..." : "Motivize"}
              </Button>
            )}
          <Button
            variant="outlined"
            type="submit"
            disabled={loading}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </div>
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
