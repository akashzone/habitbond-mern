import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Flame, Settings, LogOut } from "lucide-react";
import { useRoom } from "../context/RoomContext";
import { useUser } from "../context/UserContext";
import { apiFetch } from "../services/api";

const Sidebar = ({ roomId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearRoomId } = useRoom();
  const { user, clearUser } = useUser();
  const [rooms, setRooms] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await apiFetch("/rooms/my");
        setRooms(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRooms();
  }, [roomId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    clearRoomId();
    clearUser();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const currentRoom = rooms.find(r => r._id === roomId);

  return (
    <aside className="sidebar flex flex-col justify-between h-full bg-[#111317] border-r border-white/5 p-4 select-none">
      <div>
        <div className="sidebar-logo flex items-center gap-2 font-bold text-xl text-white mb-6 p-2">
          <Shield size={26} className="text-indigo-500" /> HabitBond
        </div>

        {/* User profile section */}
        <div className="flex items-center gap-3 p-3 mb-4 bg-white/5 border border-white/5 rounded-2xl">
          <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/30 text-xl font-bold uppercase">
                {user?.name ? user.name[0] : "U"}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-white/50 truncate">
              {user?.email || ""}
            </span>
          </div>
        </div>

        {/* Room Switcher Inline Panel (pushed content down on open) */}
        <div className="flex flex-col gap-1 mb-6">
          <label className="text-[10px] uppercase text-white/40 tracking-wider font-bold mb-1 block">Your Workspace</label>
          <div className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-200">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex justify-between items-center p-3 text-sm text-white font-medium outline-none cursor-pointer hover:bg-white/5 transition-all duration-200"
            >
              <span className="truncate">{currentRoom ? (currentRoom.name || currentRoom.roomCode) : "Select Workspace"}</span>
              <span className="text-white/40 text-xs">{isOpen ? "▲" : "▼"}</span>
            </button>
            
            {isOpen && (
              <div className="flex flex-col border-t border-white/5 bg-white/[0.02]">
                {rooms.map((r) => (
                  <button
                    key={r._id}
                    onClick={() => {
                      navigate(`/room/${r._id}`);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 text-sm text-white hover:bg-white/5 transition-all truncate border-b border-white/[0.02] ${
                      r._id === roomId ? "text-indigo-400 font-semibold bg-white/5" : ""
                    }`}
                  >
                    {r.name || r.roomCode || "Untitled Workspace"}
                  </button>
                ))}
                <button
                  onClick={() => {
                    navigate("/create");
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-3 text-sm text-indigo-400 hover:bg-white/5 transition-all font-semibold border-b border-white/[0.02]"
                >
                  + Create New Room
                </button>
                <button
                  onClick={() => {
                    navigate("/join");
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-3 text-sm text-purple-400 hover:bg-white/5 transition-all font-semibold"
                >
                  + Join via Code
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-nav flex flex-col gap-1">
          <a 
            className={`sidebar-item flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              isActive(`/room/${roomId}`) 
                ? "bg-indigo-600/20 text-indigo-400 font-medium" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`} 
            onClick={() => navigate(`/room/${roomId}`)}
          >
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a 
            className={`sidebar-item flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              isActive(`/room/${roomId}/habits`) 
                ? "bg-indigo-600/20 text-indigo-400 font-medium" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`} 
            onClick={() => navigate(`/room/${roomId}/habits`)}
          >
            <Flame size={18} /> Habits
          </a>
          <a 
            className={`sidebar-item flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              isActive(`/room/${roomId}/settings`) 
                ? "bg-indigo-600/20 text-indigo-400 font-medium" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`} 
            onClick={() => navigate(`/room/${roomId}/settings`)}
          >
            <Settings size={18} /> Settings
          </a>
        </div>
      </div>

      <button 
        className="btn btn-secondary btn-sm mt-auto" 
        onClick={handleLogout} 
        style={{ width: "100%", gap: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <LogOut size={16} /> Log Out
      </button>
    </aside>
  );
};

export default Sidebar;
