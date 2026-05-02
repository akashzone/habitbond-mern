import React, { useState } from "react";
import { apiFetch } from "../services/api";
import { Check, X } from "lucide-react";

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

const AppealItem = ({ appeal, refresh }) => {
  const currentUserId = getUserIdFromToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const creatorName = typeof appeal.userId === "object" ? appeal.userId?.name : (appeal.userId === currentUserId ? "You" : "User");
  const creatorId = typeof appeal.userId === "object" ? appeal.userId?._id : appeal.userId;
  const isCreator = creatorId === currentUserId;

  const respond = async (action) => {
    try {
      setLoading(true);
      setError("");
      await apiFetch(`/appeals/${appeal._id}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      if (refresh) refresh();
    } catch (err) {
      setError(err.message || "Failed to respond");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2 transition-all duration-200 hover:border-white/20">
      <div className="flex justify-between items-start gap-2">
        <p className="m-0 text-sm text-white/90 leading-snug">
          <b className="font-semibold text-white">{creatorName}</b>: {appeal.reason}
        </p>
        <span className={`badge badge-${appeal.status} flex-shrink-0 text-[0.7rem] px-2 py-0.5`}>
          {appeal.status}
        </span>
      </div>

      {appeal.status === "pending" && !isCreator && (
        <div className="flex gap-2 mt-1">
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/30 transition-all hover:bg-green-500/20 disabled:opacity-50" 
            onClick={() => respond("accepted")} 
            disabled={loading}
          >
            <Check size={14} /> Accept
          </button>
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 transition-all hover:bg-red-500/20 disabled:opacity-50" 
            onClick={() => respond("rejected")} 
            disabled={loading}
          >
            <X size={14} /> Reject
          </button>
        </div>
      )}

      {error && <span className="text-red-400 text-xs font-medium">{error}</span>}
    </div>
  );
};

export default AppealItem;