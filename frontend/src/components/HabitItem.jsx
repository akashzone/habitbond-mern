import React, { useState } from "react";
import CheckInButton from "./CheckInButton";
import AppealList from "./AppealList";
import AppealForm from "./AppealForm";
import StatusDisplay from "./StatusDisplay";
import { Flame, Edit3, Trash2, Check, X } from "lucide-react";
import { apiFetch } from "../services/api";

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

const HabitItem = ({ habit, roomMembers, appeals, refresh }) => {
  const currentUserId = getUserIdFromToken();
  const [isEditingHabit, setIsEditingHabit] = useState(false);
  const [editedHabitName, setEditedHabitName] = useState(habit.name);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const todayEntries = habit?.today?.entries || [];
  const isYouDone = todayEntries.find((e) => e.userId === currentUserId)?.status === "done";
  const habitAppeals = appeals?.filter((a) => a.habitId === habit._id) || [];

  const handleRequestEdit = async () => {
    try {
      setLoading(true);
      setError("");
      await apiFetch(`/habit/${habit._id}/edit-request`, {
        method: "POST",
        body: JSON.stringify({ newName: editedHabitName }),
      });
      setIsEditingHabit(false);
      if (refresh) refresh(true);
    } catch (err) {
      setError(err.message || "Failed to submit edit request");
    } finally {
      setLoading(false);
    }
  };

  const handleRespondEdit = async (action) => {
    try {
      setLoading(true);
      setError("");
      await apiFetch(`/habit/${habit._id}/edit-request/respond`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      if (refresh) refresh(true);
    } catch (err) {
      setError(err.message || "Failed to respond to edit request");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDelete = async () => {
    try {
      setLoading(true);
      setError("");
      await apiFetch(`/habit/${habit._id}/delete-request`, {
        method: "POST",
      });
      if (refresh) refresh(true);
    } catch (err) {
      setError(err.message || "Failed to submit delete request");
    } finally {
      setLoading(false);
    }
  };

  const handleRespondDelete = async (action) => {
    try {
      setLoading(true);
      setError("");
      await apiFetch(`/habit/${habit._id}/delete-request/respond`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      if (refresh) refresh(true);
    } catch (err) {
      setError(err.message || "Failed to respond to delete request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] rounded-2xl p-6 md:p-8 mb-8 transition-all duration-200 hover:border-white/20 flex flex-col gap-6">
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>

      <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
        {isEditingHabit ? (
          <div className="flex flex-col gap-2 flex-1">
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-white placeholder-white/30"
              value={editedHabitName}
              onChange={(e) => setEditedHabitName(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all"
                onClick={handleRequestEdit}
                disabled={loading}
              >
                Request Edit
              </button>
              <button
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/60 text-xs font-semibold rounded-lg transition-all"
                onClick={() => setIsEditingHabit(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white m-0 flex items-center gap-3">
                {habit.name}
                {habit.pendingAppealsCount > 0 && (
                  <span className="text-xs font-bold bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full border border-amber-500/30">
                    {habit.pendingAppealsCount} Pending
                  </span>
                )}
              </h3>
              <div className="flex gap-2">
                <button
                  className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white rounded-lg transition-all"
                  onClick={() => setIsEditingHabit(true)}
                  title="Edit Habit"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  className="p-1.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 rounded-lg transition-all"
                  onClick={handleRequestDelete}
                  title="Delete Habit"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-white/60 m-0 flex items-center gap-1.5">
              <Flame size={16} className="text-orange-400" /> 
              <span>Streak:</span> <b className="text-white font-medium">{habit.streak} days</b>
            </p>
          </div>
        )}

        <CheckInButton habitId={habit._id} isDone={isYouDone} refresh={refresh} />
      </div>

      {habit.editRequest && habit.editRequest.requestedBy && habit.editRequest.status === "pending" && (
        <div className="relative z-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-sm text-indigo-200">
          {habit.editRequest.requestedBy === currentUserId ? (
            <div>Pending edit approval to change name to <b>"{habit.editRequest.newName}"</b>. Wait for your partner.</div>
          ) : (
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span>Partner requests to change name to <b>"{habit.editRequest.newName}"</b>. Do you agree?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespondEdit("accepted")}
                  disabled={loading}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <Check size={14} /> Accept
                </button>
                <button
                  onClick={() => handleRespondEdit("rejected")}
                  disabled={loading}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/60 font-semibold rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {habit.deleteRequest && habit.deleteRequest.requestedBy && habit.deleteRequest.status === "pending" && (
        <div className="relative z-10 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-200">
          {habit.deleteRequest.requestedBy === currentUserId ? (
            <div>Pending delete approval. Wait for your partner.</div>
          ) : (
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span>Partner requests to delete this habit. Do you agree?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespondDelete("accepted")}
                  disabled={loading}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <Check size={14} /> Accept Delete
                </button>
                <button
                  onClick={() => handleRespondDelete("rejected")}
                  disabled={loading}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/60 font-semibold rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <X size={14} /> Reject Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <div className="relative z-10 bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-xl text-xs">{error}</div>}

      <div className="relative z-10">
        <h4 className="text-xs uppercase tracking-wider text-white/50 mb-4 font-semibold m-0">
          TODAY'S STATUS
        </h4>
        <StatusDisplay members={roomMembers} todayEntries={todayEntries} />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-6 border-t border-white/10 items-start">
        <div>
          <AppealForm habitId={habit._id} refresh={refresh} />
        </div>
        <div>
          <AppealList appeals={habitAppeals} refresh={refresh} />
        </div>
      </div>
    </div>
  );
};

export default HabitItem;