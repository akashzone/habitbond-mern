import React, { createContext, useState, useEffect, useContext } from "react";

import { useUser } from "./UserContext";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [currentRoomId, setCurrentRoomId] = useState(() => localStorage.getItem("currentRoomId"));
  const { user } = useUser();

  // Initialize from user if localStorage is empty
  useEffect(() => {
    const savedRoomId = localStorage.getItem("currentRoomId");
    if (savedRoomId) {
      setCurrentRoomId(savedRoomId);
    } else if (user && user.rooms && user.rooms.length > 0) {
      const roomId = typeof user.rooms[0] === "object" ? user.rooms[0]._id : user.rooms[0];
      if (roomId) {
        setCurrentRoomId(roomId);
        localStorage.setItem("currentRoomId", roomId);
      }
    }
  }, [user]);

  const saveRoomId = (roomId) => {
    setCurrentRoomId(roomId);
    localStorage.setItem("currentRoomId", roomId);
  };

  const clearRoomId = () => {
    setCurrentRoomId(null);
    localStorage.removeItem("currentRoomId");
  };

  return (
    <RoomContext.Provider value={{ currentRoomId, saveRoomId, clearRoomId }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  const { user } = useUser();
  if (!context) return null;
  if (!context.currentRoomId && user && user.rooms && user.rooms.length > 0) {
    const roomId = typeof user.rooms[0] === "object" ? user.rooms[0]._id : user.rooms[0];
    if (roomId) {
      return {
        ...context,
        currentRoomId: roomId
      };
    }
  }
  return context;
};
