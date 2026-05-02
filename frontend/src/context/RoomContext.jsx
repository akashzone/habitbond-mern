import React, { createContext, useState, useEffect, useContext } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [currentRoomId, setCurrentRoomId] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedRoomId = localStorage.getItem("currentRoomId");
    if (savedRoomId) {
      setCurrentRoomId(savedRoomId);
    }
  }, []);

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

export const useRoom = () => useContext(RoomContext);
