import React from "react";

const Cell = ({ info, update }) => {
  // Corrected destructuring
  let icon = <></>;
  let state = info.state;
  let id = info.id;

  const handleClick = () => {
    if (state === 2) {
      update(id);
    }
  };

  if (state === 1) {
    icon = info.player;
  } else if (state === -1) {
    icon = info.opponent;
  } else if (state === 2) {
    icon = "🟥";
  } else {
    icon = " ";
  }

  // Determine the cursor style
  const cursorStyle = state === 2 ? "cursor-pointer" : "cursor-default";

  return (
    <div
      onClick={handleClick}
      className={`border-gray-300 border-2 flex items-center justify-center ${cursorStyle}`}
      style={{ width: "5vw", height: "5vw" }}
    >
      <span style={{ fontSize: "3vw" }}>{icon}</span>
    </div>
  );
};

export default Cell;
