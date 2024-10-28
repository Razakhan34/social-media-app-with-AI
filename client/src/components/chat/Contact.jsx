/* eslint-disable react/prop-types */
import { useEffect } from "react";
import useConversation from "../../zhustand/useConversation";
import { useSocketContext } from "../../context/socketContex";
import useContactMessages from "../../hooks/useContactMessages";
const Contact = ({ conversation }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { loading, messages } = useContactMessages(conversation._id);

  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(conversation._id);

  let lastMessage = "";
  if (messages?.length > 0) {
    const message_data = messages[messages.length - 1];
    if (message_data?.message) {
      lastMessage = messages[messages.length - 1].message;
    } else if (message_data?.emotionImage || message_data?.images) {
      lastMessage = "📷 Image";
    } else {
      lastMessage = "Emotion";
    }
  } else {
    lastMessage = "No message yet";
  }

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);
  const isSelected = selectedConversation?._id === conversation._id;
  const handleClick = () => {
    setSelectedConversation(conversation);
  };

  return (
    <>
      {loading ? (
        <div className="loader-small"></div>
      ) : (
        <div
          className={`chat-contact ${isSelected ? "selected" : ""}`}
          onClick={handleClick}
        >
          <img
            className="chat-pic rogers"
            src={conversation.avatar.url}
            alt={conversation.name}
          />
          <span
            className={`chat-badge ${isOnline ? "user-online-now" : ""}`}
          ></span>
          <span className="chat-name">{conversation.name}</span>
          <p className="chat-message">{lastMessage}</p>
        </div>
      )}
    </>
  );
};

export default Contact;
