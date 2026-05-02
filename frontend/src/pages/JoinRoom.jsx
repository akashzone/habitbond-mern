import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useRoom } from "../context/RoomContext";
import { LogOut } from "lucide-react";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { saveRoomId, clearRoomId } = useRoom();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    clearRoomId();
    navigate("/login");
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/room/join", {
        method: "POST",
        body: JSON.stringify({ roomCode }),
      });

      if (data && data._id) {
        saveRoomId(data._id);
        navigate(`/room/${data._id}`);
      } else {
        setError(typeof data === "string" ? data : "Could not join room");
      }
    } catch (err) {
      setError(err.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Join Room
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
          <p className="text-white/60 mb-6">
            Already have an accountability partner? Enter their room code below.
          </p>

          <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              placeholder="e.g., 6X8736"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-[0_5px_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Workspace"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Don't have a code? <button onClick={() => navigate('/create')} className="text-indigo-400 hover:text-indigo-300 ml-1">Create a new room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
