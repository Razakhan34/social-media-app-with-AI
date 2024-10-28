import { useEffect, useState } from "react";
import useConversation from "../zhustand/useConversation";
import { toast } from "react-toastify";
import configuration from "../config/configuration";
import axios from "axios";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const config = {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        };
        const { data } = await axios.get(
          `${configuration.apiBaseUrl}/api/v1/messages/${selectedConversation._id}`,
          config
        );
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(data.messages);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages]);
  return { messages, loading };
};

export default useGetMessages;
