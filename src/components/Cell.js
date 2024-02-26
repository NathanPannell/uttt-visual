import React from "react";

const Cell = ({ info, update, customization }) => {
  /* 
  
  This is the component that displays individual markers and registers clicks

  - Handle click and broadcast
  - Display cell marker
  - Display cell background color

  */

  // Broadcast click to parent controlling game string
  const handleClick = () => {
    if (Math.abs(info.cellState) === 2) {
      update(info.id);
    }
  };

  /* 
  Cell state
  
  (+): Player 1
  (-): Player 2
  
  0: Blank/Invalid
  1: Filled
  2: Blank/Valid
  */
  // Custom marker for played cell
  const iconMapping = {
    1: customization.player.icon,
    "-1": customization.opponent.icon,
    2: <div className="text-transparent">0</div>,
    "-2": <div className="text-transparent">0</div>,
    0: <div className="text-transparent">0</div>,
  };

  // Highlight playable cells
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
      className={`flex items-center justify-center ${
        Math.abs(info.cellState) === 2 ? "cursor-pointer" : "cursor-default"
      } ${info.borders}`}
      style={{ background: backgroundMapping[info.cellState] }}
    >
      <span className="text-lg">{iconMapping[info.cellState]}</span>
    </button>
  );
};

export default Cell;
