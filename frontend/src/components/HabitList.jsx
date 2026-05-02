import React from "react";
import HabitItem from "./HabitItem";

const HabitList = ({ habits, roomMembers, checkIns, appeals, refresh }) => {
  if (!habits?.length) {
    return (
      <div className="dashboard-card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", margin: 0 }}>
          No habits created in this room yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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