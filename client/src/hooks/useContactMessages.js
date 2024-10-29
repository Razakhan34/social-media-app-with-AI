import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import configuration from "../config/configuration";
import axios from "axios";

const useContactMessages = (reciverId) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const config = {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        };
        const { data } = await axios.get(
          `${configuration.apiBaseUrl}/api/v1/messages/${reciverId}`,
          config
        );
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(data.messages);
      } catch (error) {
        // console.log("Raza" + error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reciverId]);
  return { messages, loading };
};

export default useContactMessages;
