import React, { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { apiFetch } from "../services/api";
import { socket } from "../socket";
import Sidebar from "./Sidebar";
import { useRoom } from "../context/RoomContext";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.userId;
  } catch (e) {
    return null;
  }
};

const RoomLayout = () => {
  const { roomId } = useParams();
  const { saveRoomId } = useRoom();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async (background = false) => {
    try {
      if (!background) setLoading(true);
      setError("");
      const data = await apiFetch(`/room/${roomId}/dashboard`);
      setDashboardData(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      if (!background) setLoading(false);
    }
  };

  const fetchDashboardBackground = async () => {
    try {
      const data = await apiFetch(`/room/${roomId}/dashboard`);
      setDashboardData(data);
    } catch (err) {
      console.error("Background dashboard sync error:", err);
    }
  };

  useEffect(() => {
    if (roomId) {
      saveRoomId(roomId);
    }
    fetchDashboard();
  }, [roomId]);

  useEffect(() => {
    socket.connect();
    socket.emit("join:room", { roomId });

    const handleUpdate = () => {
      fetchDashboardBackground();
    };

    socket.on("checkin:update", handleUpdate);
    socket.on("appeal:new", handleUpdate);
    socket.on("appeal:response", handleUpdate);
    socket.on("habit:new", handleUpdate);
    socket.on("habit:editRequest", handleUpdate);
    socket.on("habit:deleteRequest", handleUpdate);
    socket.on("habit:updated", handleUpdate);
    socket.on("habit:deleted", handleUpdate);

    return () => {
      socket.off("checkin:update", handleUpdate);
      socket.off("appeal:new", handleUpdate);
      socket.off("appeal:response", handleUpdate);
      socket.off("habit:new", handleUpdate);
      socket.off("habit:editRequest", handleUpdate);
      socket.off("habit:deleteRequest", handleUpdate);
      socket.off("habit:updated", handleUpdate);
      socket.off("habit:deleted", handleUpdate);
      socket.disconnect();
    };
  }, [roomId]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar roomId={roomId} />
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <Sidebar roomId={roomId} />
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <p style={{ color: "var(--error)", fontSize: "1.1rem" }}>{error}</p>
          <button className="btn" onClick={fetchDashboard}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { room } = dashboardData || {};

  return (
    <div className="dashboard-layout">
      {/* 1. Sidebar (Left) */}
      <Sidebar roomId={roomId} />

      {/* 2. Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginRight: "0.5rem" }}>
              Room Code:
            </span>
            <span className="badge" style={{ backgroundColor: "var(--bg-accent)", fontSize: "0.9rem" }}>
              {room?.roomCode || "N/A"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {room?.members?.map((m) => {
              const tokenUserId = getUserIdFromToken();
              const isYou = m._id === tokenUserId;
              return (
                <span
                  key={m._id}
                  className="badge"
                  style={{
                    background: isYou ? "linear-gradient(135deg, #47484c, #1e2023)" : "rgba(255, 255, 255, 0.04)",
                    color: isYou ? "#fff" : "rgba(255, 255, 255, 0.65)",
                    border: isYou ? "1px solid rgba(255, 255, 255, 0.45)" : "1px solid rgba(255, 255, 255, 0.08)",
                    fontSize: "0.85rem",
                    padding: "0.5rem 1rem",
                    boxShadow: isYou ? "0 0 15px rgba(255, 255, 255, 0.1)" : "none",
                    fontWeight: isYou ? "bold" : "normal"
                  }}
                >
                  {isYou ? "You" : "Partner"} ({m.name})
                </span>
              );
            })}
          </div>
        </header>

        {/* Inner Views via Outlet */}
        <div className="dashboard-container">
          <Outlet context={{ dashboardData, fetchDashboard }} />
        </div>
      </div>
    </div>
  );
};

export default RoomLayout;
