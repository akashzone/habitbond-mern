import React from "react";
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

const StatusDisplay = ({ members, todayEntries }) => {
  const currentUserId = getUserIdFromToken();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {members?.map((m) => {
        const isYou = m._id === currentUserId;
        const entry = todayEntries?.find(e => e.userId === m._id);
        const isDone = entry?.status === "done";

        return (
          <div
            key={m._id}
            className={`rounded-xl p-4 flex flex-col items-center justify-center border transition-all duration-300 ${
              isDone
                ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="text-white/60 text-sm font-medium mb-2">
              {isYou ? "You" : "Partner"} ({m.name})
            </div>
            <div className="flex items-center gap-2 font-bold text-base">
              {isDone ? (
                <><Check size={18} /> Done</>
              ) : (
                <><X size={18} /> Not Done</>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusDisplay;
