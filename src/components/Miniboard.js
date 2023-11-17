import React from "react";
import Cell from "./Cell";

const Miniboard = ({ row, settings, update, winner, active }) => {
  let background;
  let icon;
  let newRow;

  if (active.board && winner === 0) {
    newRow = row.map((obj) => {
      return {
        ...obj,
        state: obj.state === 0 || obj.state === undefined ? active.turn : obj.state,
      };
    });
  } else {
    newRow = row;
  }

  if (winner === 0) {
    background = "transparent";
  }
  if (winner === 1) {
    // player 1 wins
    icon = settings.playerIcon;
    background = `hsl(${settings.playerColor}, 100%, 80%)`;
  } else if (winner === -1) {
    // player 2 wins
    icon = settings.opponentIcon;
    background = `hsl(${settings.opponentColor}, 100%, 80%)`;
  } else if (winner === 2) {
    // stalemate
    background = "rgba(0,0,0,0.4)";
    icon = "🟰";
  }

  // Corrected destructuring
  return (
    <div
      className={"relative justify-stretch  grid grid-cols-3 aspect-square border-4 border-gray-700"}
      style={{ background: background }}
    >
      {newRow.map((info) => (
        <Cell key={info.id} info={info} update={update} />
      ))}

      <div
        className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
        style={{ pointerEvents: "none", opacity: 0.3 }}
      >
        <span className="text-6xl">{icon}</span>
      </div>
    </div>
  );
};

export default Miniboard;
