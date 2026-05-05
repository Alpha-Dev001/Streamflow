import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Connect to the backend Socket.io server
    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const newSocket = io(socketUrl, {
      auth: {
        // Send token so that server knows who we are
        token: localStorage.getItem("token"),
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    setSocket(newSocket);

    // Cleanup when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [isLoggedIn]); // reconnect when login state changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
