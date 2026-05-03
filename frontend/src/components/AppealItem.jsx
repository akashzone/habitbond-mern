import React, { useState } from "react";
import { apiFetch } from "../services/api";
import { Check, X, Edit2 } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editReason, setEditReason] = useState(appeal.reason);

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

  const saveEdit = async () => {
    try {
      setLoading(true);
      setError("");
      await apiFetch(`/appeals/${appeal._id}`, {
        method: "PUT",
        body: JSON.stringify({ reason: editReason }),
      });
      setIsEditing(false);
      if (refresh) refresh();
    } catch (err) {
      setError(err.message || "Failed to edit appeal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 min-h-[46px] flex flex-col justify-center transition-all duration-200 hover:border-white/20">
      <div className="flex justify-between items-center gap-3">
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-indigo-500"
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all"
                onClick={saveEdit}
                disabled={loading}
              >
                Save
              </button>
              <button
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/60 text-xs font-semibold rounded-lg transition-all"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="m-0 text-sm text-white/90 leading-snug">
              <b className="font-semibold text-white">{isCreator ? "You" : creatorName}</b>: {appeal.reason}
            </p>
            <span className={`badge badge-${appeal.status} flex-shrink-0 text-[0.7rem] px-2 py-0.5`}>
              {appeal.status}
            </span>
          </>
        )}
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

      {appeal.status === "pending" && isCreator && !isEditing && (
        <div className="flex gap-2 mt-1">
          <button
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-white/60 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={12} /> Edit
          </button>
        </div>
      )}

      {error && <span className="text-red-400 text-xs font-medium">{error}</span>}
    </div>
  );
};

export default AppealItem;