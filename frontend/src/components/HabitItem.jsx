import React from "react";
import CheckInButton from "./CheckInButton";
import AppealList from "./AppealList";
import AppealForm from "./AppealForm";
import StatusDisplay from "./StatusDisplay";
import { Flame } from "lucide-react";

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
  const todayEntries = habit?.today?.entries || [];

  const isYouDone = todayEntries.find((e) => e.userId === currentUserId)?.status === "done";
  const habitAppeals = appeals?.filter((a) => a.habitId === habit._id) || [];

  return (
    <div className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] rounded-2xl p-6 md:p-8 mb-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_45px_rgba(0,0,0,0.7)] flex flex-col gap-6">
      {/* Subtle Gradient Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>

      <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-white m-0 flex items-center">
            {habit.name}
            {habit.pendingAppealsCount > 0 && (
              <span className="ml-3 text-xs font-bold bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full border border-amber-500/30">
                {habit.pendingAppealsCount} Pending
              </span>
            )}
          </h3>
          <p className="text-sm text-white/60 m-0 flex items-center gap-1.5">
            <Flame size={16} className="text-orange-400" /> 
            <span>Streak:</span> <b className="text-white font-medium">{habit.streak} days</b>
          </p>
        </div>

        <CheckInButton habitId={habit._id} isDone={isYouDone} refresh={refresh} />
      </div>

      <div className="relative z-10">
        <h4 className="text-xs uppercase tracking-wider text-white/50 mb-4 font-semibold m-0">
          TODAY'S STATUS
        </h4>
        <StatusDisplay members={roomMembers} todayEntries={todayEntries} />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-6 border-t border-white/10">
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