import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import configuration from "../config/configuration";
import axios from "axios";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async (name = "") => {
      setLoading(true);
      try {
        const config = {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        };
        const { data } = await axios.get(
          `${configuration.apiBaseUrl}/api/v1/users/usersByName?name=${name}`,
          config
        );
        console.log(data.users);
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data.users);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);
  return { loading, conversations };
};

export default useGetConversations;
