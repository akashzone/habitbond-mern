import React from "react";
import AppealItem from "./AppealItem";

const AppealList = ({ appeals, refresh }) => {
  if (!appeals || appeals.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h4 className="m-0 text-xs font-semibold text-white/50 uppercase tracking-wider">
          Recent Appeals
        </h4>
        <p className="m-0 text-white/40 text-sm italic">
          No appeals for this habit.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h4 className="m-0 text-xs font-semibold text-white/50 uppercase tracking-wider">
        Recent Appeals
      </h4>
      <div className="flex flex-col gap-3">
        {appeals.map((appeal) => (
          <AppealItem
            key={appeal._id}
            appeal={appeal}
            refresh={refresh}
          />
        ))}
      </div>
    </div>
  );
};

export default AppealList;