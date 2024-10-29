/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
// import socketClient from "socket.io-client";
import { useSelector } from "react-redux";

// ./App.scss';;
// const SERVER = "http://127.0.0.1:8080";

import configuration from "../config/configuration";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketFlask, setSocketFlask] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      const socket = io(`${configuration.apiBaseUrl}`, {
        query: {
          userId: user._id,
        },
      });

      setSocket(socket);

      // Connect to Flask server
      const socketFlask = io(`${configuration.flaskBaseUrl}`, {
        query: {
          userId: user._id,
        },
      });
      setSocketFlask(socketFlask);

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketFlask.close();
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      if (socketFlask) {
        socketFlask.close();
        setSocketFlask(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, socketFlask, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
