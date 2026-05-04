import React from "react";
import HabitItem from "./HabitItem";

const HabitList = ({ habits, roomMembers, checkIns, appeals, refresh }) => {
  if (!habits?.length) {
    return (
      <div className="dashboard-card w-full text-center p-6 sm:p-10">
        <p className="text-white/50 text-base sm:text-lg m-0">
          No habits created in this room yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-full overflow-x-hidden">
      {habits.map((habit) => (
        <HabitItem
          key={habit._id}
          habit={habit}
          roomMembers={roomMembers}
          checkIns={checkIns}
          appeals={appeals}
          refresh={refresh}
        />
      ))}
    </div>
  );
};

export default HabitList;