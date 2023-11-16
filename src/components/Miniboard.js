import React from "react";
import Cell from "./Cell";

const Miniboard = ({ row, update, winner, active }) => {
  let background;
  let icon;
  let newRow;

  if (active && winner === 0) {
    newRow = row.map((obj) => {
      return {
        ...obj,
        state: obj.state === 0 || obj.state === undefined ? 2 : obj.state,
      };
    });
  } else {
    newRow = row;
  }

  if (winner === 0) {
    background = "bg-transparent";
  }
  if (winner === 1) {
    // player 1 wins
    background = "bg-yellow-200";
    icon = row[0].player;
  } else if (winner === -1) {
    // player 2 wins
    background = "bg-blue-200";
    icon = row[0].opponent;
  } else if (winner === 2) {
    // stalemate
    background = "bg-gray-200";
    icon = "🟰";
  }

  // Corrected destructuring
  return (
    <div className={"relative grid grid-cols-3 aspect-square border-4 border-gray-700 " + background}>
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
