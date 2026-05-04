import React, { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="dashboard-layout flex min-h-screen bg-[#0d0f12] text-white">
        <Sidebar roomId={roomId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content flex-1 flex items-center justify-center p-4">
          <p className="text-white/40 text-lg">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout flex min-h-screen bg-[#0d0f12] text-white">
        <Sidebar roomId={roomId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content flex-1 flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button className="btn" onClick={() => fetchDashboard()}>Retry</button>
        </div>
      </div>
    );
  }

  const { room } = dashboardData || {};

  return (
    <div className="dashboard-layout flex min-h-screen bg-[#0d0f12] text-white relative overflow-x-hidden w-full max-w-full">
      {/* Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. Sidebar (Left) */}
      <Sidebar roomId={roomId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Area */}
      <div className="main-content flex-1 flex flex-col min-h-screen overflow-y-auto max-w-full w-full">
        {/* Top Header */}
        <header className="top-header flex justify-between items-center bg-[#0d0f12]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-4 sticky top-0 z-30 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-white hover:bg-white/5 rounded-lg md:hidden flex items-center justify-center flex-shrink-0 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs md:text-sm text-white/50">Room Code:</span>
              <span className="badge bg-white/5 border border-white/10 text-white font-mono text-sm px-2.5 py-1 rounded-lg">
                {room?.roomCode || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-end">
            {room?.members?.map((m) => {
              const tokenUserId = getUserIdFromToken();
              const isYou = m._id === tokenUserId;
              return (
                <span
                  key={m._id}
                  className={`text-xs md:text-sm px-3 py-1.5 rounded-xl border flex items-center ${
                    isYou 
                      ? "bg-white/5 border-white/20 text-white font-semibold" 
                      : "bg-white/[0.02] border-white/5 text-white/60"
                  }`}
                >
                  {isYou ? "You" : "Partner"} ({m.name})
                </span>
              );
            })}
          </div>
        </header>

        {/* Inner Views via Outlet */}
        <div className="dashboard-container flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full box-border">
          <Outlet context={{ dashboardData, fetchDashboard }} />
        </div>
      </div>
    </div>
  );
};

export default RoomLayout;
