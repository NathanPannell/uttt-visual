import React from "react";

const Cell = ({ info, update, customization }) => {
  // broadcast click to App.js
  const handleClick = () => {
    if (Math.abs(info.cellState) === 2) {
      update(info.id);
    }
  };

  // custom marker for played cell
  const iconMapping = {
    1: customization.player.icon,
    "-1": customization.opponent.icon,
    2: <div className="text-transparent">0</div>,
    "-2": <div className="text-transparent">0</div>,
    0: <div className="text-transparent">0</div>,
  };

  // highlight playable cells
  const backgroundMapping = {
    1: "transparent",
    2: `hsl(${customization.player.color}, 100%, 92%)`,
    "-1": "transparent",
    "-2": `hsl(${customization.opponent.color}, 100%, 92%)`,
    0: "transparent",
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center cursor-default ${info.borders}`}
      style={{ background: backgroundMapping[info.cellState] }}
    >
      <span className="text-sm">{iconMapping[info.cellState]}</span>
    </button>
  );
};

export default Cell;
