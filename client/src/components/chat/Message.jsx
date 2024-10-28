/* eslint-disable react/prop-types */
// import useConversation from "../../zhustand/useConversation";
// import { extractTime } from "./extractTime";
import useListenMessages from "../../hooks/useListenMessages";
import { useSelector } from "react-redux";
import extractTime from "./extractTime";

const Message = ({ message }) => {
  const { user } = useSelector((state) => state.user);
  // const { selectedConversation } = useConversation();
  useListenMessages();
  const fromMe = message.senderId === user._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-by-me" : "chat-by-other";
  // const profilePic = fromMe
  //   ? user.avatar.url
  //   : selectedConversation?.avatar.url;
  // const bubbleColor = fromMe ? "bubble-me" : "bubble-other";
  const shakeClass = message.shouldShake ? "shake" : "";

  let displayImage = <></>;
  if (message.message !== "") {
    displayImage = (
      <>
        <div className={`chat-message ${chatClassName} ${shakeClass}`}>
          {message.message}{" "}
          <span className="chat-time-formatted">{formattedTime}</span>
        </div>
      </>
    );
  }

  if (message?.images?.length > 0) {
    displayImage = message.images.map((image, index) => (
      <div
        className={`chat-message ${chatClassName} ${shakeClass} chat-by-me-image`}
        key={index + 1}
      >
        <div className={`chat-message-image-container ${shakeClass}`}>
          <img src={image.url} alt="chat pic" />
        </div>
      </div>
    ));
  }

  if (message.emotionImage && user._id !== message.senderId) {
    displayImage = (
      <>
        <div
          className={`chat-message ${chatClassName} ${shakeClass} chat-by-me-image`}
        >
          <div className="chat-message-image-container">
            <img src={message.emotionImage.url} alt="chat pic" />
          </div>
        </div>
        <div className={`chat-emotion-message ${shakeClass}`}>
          Your friend is <strong>{message.emotionPrediction}</strong> now{" "}
          <span className="chat-time-formatted">{extractTime(new Date())}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div>{displayImage}</div>
    </>
  );
};

export default Message;
