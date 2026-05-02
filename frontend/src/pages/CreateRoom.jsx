import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useRoom } from "../context/RoomContext";
import { LogOut } from "lucide-react";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveRoomId, clearRoomId } = useRoom();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    clearRoomId();
    navigate("/login");
  };

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/room/create", {
        method: "POST",
      });

      if (data && data.room && data.room._id) {
        saveRoomId(data.room._id);
        navigate(`/room/${data.room._id}`);
      } else {
        setError("Could not create room");
      }
    } catch (err) {
      setError(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Create Room
          </h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <p className="text-white/60 mb-8">
            Set up a new secure workspace. You'll receive a unique code to invite your accountability partner.
          </p>

          <button 
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-[0_5px_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
          >
            {loading ? "Initializing Workspace..." : "Create New Workspace"}
          </button>

          <div className="mt-6 text-center text-sm text-white/40">
            Already have a code? <button onClick={() => navigate('/join')} className="text-indigo-400 hover:text-indigo-300 ml-1">Join existing room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
