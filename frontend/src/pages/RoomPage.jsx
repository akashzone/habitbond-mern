import React from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Flame, Check, X, ShieldAlert, Trophy } from "lucide-react";
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

const RoomPage = () => {
  const { roomId } = useParams();
  const { dashboardData, fetchDashboard } = useOutletContext();
  const { room, habits, pendingAppeals } = dashboardData || {};

  const currentUserId = getUserIdFromToken();

  // 1. Calculations
  const totalHabits = habits?.length || 0;
  
  const yourDoneCount = habits?.filter((h) => 
    (h?.today?.entries || []).some((e) => e.userId === currentUserId && e.status === "done")
  ).length || 0;
  const yourCompletion = totalHabits > 0 ? Math.round((yourDoneCount / totalHabits) * 100) : 0;

  const partnerUser = room?.members?.find((m) => m._id !== currentUserId);
  const partnerDoneCount = habits?.filter((h) => 
    (h?.today?.entries || []).some((e) => e.userId === partnerUser?._id && e.status === "done")
  ).length || 0;
  const partnerCompletion = totalHabits > 0 ? Math.round((partnerDoneCount / totalHabits) * 100) : 0;

  const maxStreak = habits?.reduce((max, h) => Math.max(max, h.streak || 0), 0) || 0;

  // Highlights
  const bestStreakHabit = habits?.sort((a, b) => (b.streak || 0) - (a.streak || 0))[0];
  const atRiskHabits = habits?.filter((h) => (h.streak || 0) > 0 && !(h?.today?.entries || []).some(e => e.status === "done"));

  const respondToAppeal = async (appealId, action) => {
    try {
      await apiFetch(`/appeals/${appealId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      fetchDashboard();
    } catch (err) {
      console.error("Failed to respond to appeal:", err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-white m-0">
          Workspace Overview
        </h1>
        <p className="text-white/60 mt-1 mb-0">
          Today's progress at a glance
        </p>
      </div>

      {/* 2. Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 backdrop-blur-xl">
          <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Total Habits</span>
          <span className="text-3xl font-extrabold text-white">{totalHabits}</span>
        </div>
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 backdrop-blur-xl">
          <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Your Completion</span>
          <span className="text-3xl font-extrabold text-indigo-400">{yourCompletion}%</span>
        </div>
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 backdrop-blur-xl">
          <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Partner Completion</span>
          <span className="text-3xl font-extrabold text-purple-400">{partnerCompletion}%</span>
        </div>
        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 backdrop-blur-xl">
          <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Max Streak</span>
          <span className="text-3xl font-extrabold text-amber-400">{maxStreak}</span>
        </div>
      </div>

      {/* 3. Columns: Progress Table + Pending Appeals */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress List */}
        <div className="lg:col-span-2 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy className="text-amber-400" size={18} />
            Today's Progress
          </h2>
          {totalHabits > 0 ? (
            <div className="flex flex-col gap-2">
              {habits.map((h) => {
                const entries = h?.today?.entries || [];
                const isYouDone = entries.some(e => e.userId === currentUserId && e.status === "done");
                const isPartnerDone = entries.some(e => e.userId === partnerUser?._id && e.status === "done");

                return (
                  <div key={h._id} className="flex justify-between items-center p-3.5 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all rounded-xl gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-white truncate">{h.name}</span>
                      <span className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                        <Flame size={12} className="text-orange-400" /> {h.streak || 0} days streak
                      </span>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">You</span>
                        {isYouDone ? (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <Check size={12} /> Done
                          </span>
                        ) : (
                          <span className="text-xs bg-white/5 text-white/30 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] uppercase text-white/40 tracking-widest font-bold">Partner</span>
                        {isPartnerDone ? (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                            <Check size={12} /> Done
                          </span>
                        ) : (
                          <span className="text-xs bg-white/5 text-white/30 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-6">No habits tracked in this room yet.</p>
          )}
        </div>

        {/* Actionable Appeals Panel */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl flex flex-col h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ShieldAlert className="text-red-400" size={18} />
            Pending Appeals
          </h2>
          {pendingAppeals && pendingAppeals.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pendingAppeals.map((a) => {
                const creatorName = typeof a.userId === "object" ? a.userId?.name : "Partner";
                const isCreator = typeof a.userId === "object" ? a.userId?._id === currentUserId : a.userId === currentUserId;

                return (
                  <div key={a._id} className="p-3 bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all rounded-xl flex flex-col gap-3">
                    <p className="m-0 text-sm text-white/90 leading-snug">
                      <b className="font-semibold text-white">{creatorName}</b>: {a.reason}
                    </p>
                    {a.status === "pending" && !isCreator && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToAppeal(a._id, "accepted")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/30 transition-all hover:bg-green-500/20"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respondToAppeal(a._id, "rejected")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 transition-all hover:bg-red-500/20"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm text-center py-6 mb-0">No pending appeals.</p>
          )}
        </div>
      </div>

      {/* 4. Highlights Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {bestStreakHabit && (
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 flex-shrink-0">
              <Trophy className="text-amber-400" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-white/40 tracking-wider font-bold">Best Streak</span>
              <span className="text-base font-bold text-white">{bestStreakHabit.name}</span>
              <span className="text-xs text-amber-400/80 font-medium">{bestStreakHabit.streak || 0} days streak</span>
            </div>
          </div>
        )}

        {atRiskHabits && atRiskHabits.length > 0 && (
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30 flex-shrink-0">
              <ShieldAlert className="text-red-400" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase text-white/40 tracking-wider font-bold">At-Risk Streaks</span>
              <span className="text-base font-bold text-white">Action Required</span>
              <span className="text-xs text-red-400/80 font-medium">Don't miss checking in today!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;