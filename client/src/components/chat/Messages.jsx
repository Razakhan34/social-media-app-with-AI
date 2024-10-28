/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
// import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import extractTime from "./extractTime";
import { Button } from "@mui/material";
import useConversation from "../../zhustand/useConversation";
// import MessageSkeleton from "./MessageSkeleton";

const Messages = ({ onEmotionPermission }) => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef();
  const [isEmotionPerVisible, setEmotionPerVisible] = useState(true);

  const { selectedConversation } = useConversation();

  const currentTime = extractTime(new Date().toISOString());

  const yesPermissionHandler = () => {
    setEmotionPerVisible(false);
    onEmotionPermission(true);
  };

  const noPermissionHandler = () => {
    setEmotionPerVisible(false);
    onEmotionPermission(false);
  };

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
  return (
    <>
      <div className="chat-messages">
        <p className="chat-time">Today at {currentTime}</p>
        {isEmotionPerVisible && (
          <div className="chat-permission">
            <h3>Is {selectedConversation.name} your close friend ? </h3>
            <div className="chat-permission-button">
              <Button
                variant="outlined"
                color="error"
                onClick={noPermissionHandler}
              >
                No
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={yesPermissionHandler}
              >
                Yes
              </Button>
            </div>
            <p>
              your image might be send to your friend for{" "}
              <strong>for better conversation experience</strong>
            </p>
          </div>
        )}
        {!isEmotionPerVisible &&
          !loading &&
          messages?.length > 0 &&
          messages.map((message, index) => (
            <div
              key={index + 1}
              ref={index === messages?.length - 1 ? lastMessageRef : null}
            >
              <Message message={message} />
            </div>
          ))}
        {/* {loading && [...Array(5)].map((_, idx) => <MessageSkeleton key={idx} />)} */}
        {!isEmotionPerVisible && !loading && messages?.length === 0 && (
          <p className="no-messages">
            Send a message to start the conversation
          </p>
        )}
      </div>
    </>
  );
};

export default Messages;
