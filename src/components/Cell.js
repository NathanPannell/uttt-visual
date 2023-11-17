import React from "react";

const Cell = ({ info, update }) => {
  // Corrected destructuring
  let icon = <></>;
  let state = info.state;
  let id = info.id;
  let styling;

  const handleClick = () => {
    if (state === 2 || state === -2) {
      update(id);
    }
  };

  if (state === 1) {
    icon = info.player.icon;
    styling = "cursor-default";
  } else if (state === -1) {
    icon = info.opponent.icon;
    styling = "cursor-default";
  } else if (state === 2) {
    icon = (
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
        <rect width="12" height="12" style={{ fill: `hsl(${info.player.color}, 100%, 50%)` }} />
      </svg>
    );
    styling = "cursor-pointer";
  } else if (state === -2) {
    icon = (
      <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
        <rect width="12" height="12" style={{ fill: `hsl(${info.opponent.color}, 100%, 50%)` }} />
      </svg>
    );
    styling = "cursor-pointer";
  } else {
    icon = "o";
    styling = "cursor-default text-transparent";
  }

  return (
    <div
      onClick={handleClick}
      className={`aspect-square border-gray-300 border-2 flex items-center justify-center ${styling}`}
    >
      <span className="text-sm">{icon}</span>
      {/* <span className="text-sm">{id}</span> */}
    </div>
  );
};

export default Cell;
