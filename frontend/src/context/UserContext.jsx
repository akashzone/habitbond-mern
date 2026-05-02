import React, { createContext, useState, useEffect, useContext } from "react";
import { apiFetch } from "../services/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch("/users/me", {
        method: "GET"
      });
      if (data && data._id) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to fetch user in context:", err.message);
      // Fallback to localStorage if offline or failed
      const localUserData = localStorage.getItem("user");
      if (localUserData) {
        try {
          setUser(JSON.parse(localUserData));
        } catch (e) {
          console.error("Invalid JSON in local user storage");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUserProfile = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem("user", JSON.stringify(updatedData));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUserProfile, fetchUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
