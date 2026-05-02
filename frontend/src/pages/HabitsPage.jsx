import React, { useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import HabitList from "../components/HabitList";
import CreateHabit from "../components/CreateHabit";

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

const HabitsPage = () => {
  const { roomId } = useParams();
  const { dashboardData, fetchDashboard } = useOutletContext();
  const { room, habits, pendingAppeals } = dashboardData || {};

  const currentUserId = getUserIdFromToken();
  const [filter, setFilter] = useState("all");

  const filteredHabits = habits?.filter((h) => {
    const isYouDone = (h?.today?.entries || []).some(
      (e) => e.userId === currentUserId && e.status === "done"
    );
    if (filter === "completed") return isYouDone;
    if (filter === "missed") return !isYouDone;
    return true;
  });

  return (
    <>
      <div className="dashboard-card mb-8 p-6 lg:p-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <h1 className="text-2xl font-bold text-white m-0">
          Your Habits
        </h1>
        <p className="text-white/60 mt-2 mb-6">
          Manage and build actionable routines with your accountability partner.
        </p>

        <CreateHabit roomId={roomId} refresh={fetchDashboard} />
      </div>

      {/* 2. Filter tabs */}
      <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl w-fit border border-white/5">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            filter === "all"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            filter === "completed"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("missed")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            filter === "missed"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          Missed
        </button>
      </div>

      {/* 3. Filtered list */}
      {filteredHabits && filteredHabits.length > 0 ? (
        <HabitList
          habits={filteredHabits}
          roomMembers={room?.members}
          appeals={pendingAppeals}
          refresh={fetchDashboard}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl mt-4">
          <p className="text-white/50 text-lg mb-0">No habits match the selected filter.</p>
        </div>
      )}
    </>
  );
};

export default HabitsPage;
