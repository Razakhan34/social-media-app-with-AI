import { useState } from "react";
import useConversation from "./../zhustand/useConversation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const useGetEmotionMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { user } = useSelector((state) => state.user);

  const getEmotionMessage = async () => {
    setLoading(true);
    try {
      const senderId = user._id;
      const receiverId = selectedConversation._id;
      console.log(senderId, receiverId);
      const res = await fetch(
        `http://127.0.0.1:8000/send_emotion_message/${receiverId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senderId: senderId }),
        }
      );

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const newMessage = JSON.parse(data.newMessage);
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, getEmotionMessage };
};

export default useGetEmotionMessage;
