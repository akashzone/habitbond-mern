import React, { useState } from "react";
import { apiFetch } from "../services/api";

const CheckInButton = ({ habitId, isDone, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setMsg("");
      setErrorMsg("");

      await apiFetch("/checkin", {
        method: "POST",
        body: JSON.stringify({ habitId }),
      });

      setMsg("Saved!");
      refresh();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (isDone) {
    return (
      <button 
        disabled 
        className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
      >
        Completed Today
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button 
        onClick={handleCheckIn} 
        disabled={loading}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 hover:from-indigo-400 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] disabled:bg-white/10 disabled:from-transparent disabled:to-transparent disabled:text-white/40 disabled:shadow-none disabled:border disabled:border-white/5 disabled:cursor-not-allowed"
      >
        {loading ? "Checking In..." : "Mark Done"}
      </button>
      {msg && <span className="text-green-400 text-xs font-medium">{msg}</span>}
      {errorMsg && <span className="text-red-400 text-xs font-medium">{errorMsg}</span>}
    </div>
  );
};

export default CheckInButton;