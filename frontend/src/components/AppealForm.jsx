import React, { useState } from "react";
import { apiFetch } from "../services/api";

const AppealForm = ({ habitId, refresh }) => {
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submitAppeal = async () => {
    if (!reason.trim()) {
      setErrorMsg("Please enter a valid reason");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      setErrorMsg("");

      await apiFetch("/appeals", {
        method: "POST",
        body: JSON.stringify({
          habitId,
          reason,
        }),
      });

      setReason("");
      setMsg("Appeal submitted successfully!");
      if (refresh) refresh();
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h4 className="m-0 text-xs font-semibold text-white/50 uppercase tracking-wider">
        Appeal Missed Habit
      </h4>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-sm text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
          placeholder="e.g., Had fever"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />
        <button 
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 hover:from-indigo-400 hover:to-purple-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] disabled:bg-white/10 disabled:from-transparent disabled:to-transparent disabled:text-white/40 disabled:shadow-none disabled:cursor-not-allowed flex-shrink-0" 
          onClick={submitAppeal} 
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
      {msg && <span className="text-green-400 text-xs font-medium">{msg}</span>}
      {errorMsg && <span className="text-red-400 text-xs font-medium">{errorMsg}</span>}
    </div>
  );
};

export default AppealForm;