import React from "react";
import Cell from "./Cell";

const Miniboard = ({ update, borders, customization, info }) => {
  /* 
  
  This is the 3x3 board controlling 9 <Cell /> components

  - Style border
  - Assign 'valid' state for possible next moves
  - For closed position board:
      1. Background color of winning player
      2. Background icon of winning player
      3. Disable interaction (clicking) of miniboard
  
  */

  // Interior borders for game board
  const getBorderStyle = (index) => ({
    borderR: index % 3 < 2 ? "black" : "transparent",
    borderL: index % 3 > 0 ? "black" : "transparent",
    borderB: index < 6 ? "black" : "transparent",
    borderT: index > 2 ? "black" : "transparent",
  });

  // Mark empty cells active, if miniboard is active
  const newRow =
    info.active && !info.winner
      ? info.row.map(({ cellState, ...rest }) => ({
          ...rest,
          cellState: cellState ? cellState : 2 * info.turn,
        }))
      : info.row;

  // Overlay icons, for won miniboards
  const iconMapping = {
    0: "",
    1: customization.player.icon,
    "-1": customization.opponent.icon,
    2: "🟰",
  };

  const backgroundMapping = {
    0: "transparent", // Open position
    1: `hsl(${customization.player.color}, 100%, 80%)`, // Player 1 win
    "-1": `hsl(${customization.opponent.color}, 100%, 80%)`, // Player 2 win
    2: "rgba(0,0,0,0.4)", // Stalemate
  };

  // Overlay element for finished board, disables interaction with closed miniboards
  const renderOverlay = (winner) => {
    return winner ? (
      <div
        className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
        style={{ pointerEvents: "none" }}
      >
        <span className="text-6xl opacity-30">{iconMapping[winner]}</span>
      </div>
    ) : (
      ""
    );
  };

  return (
    <div
      className={`relative justify-stretch p-1 grid grid-cols-3 aspect-square ${borders}`}
      style={{ background: backgroundMapping[info.winner] }}
    >
      {newRow.map((info, index) => {
        const { borderR, borderL, borderB, borderT } = getBorderStyle(index);

        return (
          <Cell
            key={info.id}
            info={{
              ...info,
              borders: `border border-r-${borderR} border-l-${borderL} border-b-${borderB} border-t-${borderT}`,
            }}
            customization={customization}
            update={update}
          />
        );
      })}
      {renderOverlay(info.winner)}
    </div>
  );
};

export default Miniboard;
