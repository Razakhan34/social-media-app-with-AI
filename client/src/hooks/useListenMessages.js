import { useEffect } from "react";
import { useSocketContext } from "../context/socketContex";
import useConversation from "../zhustand/useConversation";
// import notificationSound from "../assets/message_sound.mp3";
const useListenMessages = () => {
  const { socket, socketFlask } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      // const sound = new Audio(notificationSound);
      setMessages([...messages, newMessage]);
      // sound.play();
    });
    socketFlask?.on("newMessageFromFlask", (newMessage) => {
      newMessage.shouldShake = true;
      // const sound = new Audio(notificationSound);
      setMessages([...messages, newMessage]);
      // sound.play();
    });

    return () => {
      socket?.off("newMessage");
      socketFlask?.off("newMessageFromFlask");
    };
  }, [socket, socketFlask, setMessages, messages]);
};

export default useListenMessages;
