import { useState } from "react";
import useConversation from "./../zhustand/useConversation";
import { toast } from "react-toastify";
import configuration from "../config/configuration";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const sendMessage = async (message, images) => {
    setLoading(true);
    try {
      const config = {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `${configuration.apiBaseUrl}/api/v1/messages/send/${selectedConversation._id}`,
        { message, images },
        config
      );
      if (data.error) {
        throw new Error(data.error);
      }
      if (messages) {
        setMessages([...messages, data.newMessage]);
      } else {
        setMessages([data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, sendMessage };
};

export default useSendMessage;
