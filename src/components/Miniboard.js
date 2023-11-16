import React from "react";
import Cell from "./Cell";

const Miniboard = ({ row, update }) => {
  const bingos = ["012", "345", "678", "036", "147", "258", "048", "246"];

  function getState(row) {
    for (const bingo of bingos) {
      if (
        row[bingo[0]].state != 0 &&
        row[bingo[0]].state === row[bingo[1]].state &&
        row[bingo[1]].state === row[bingo[2]].state
      ) {
        return row[bingo[0]].state;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (row[i].state === 0 || row[i].state === undefined) {
        return 0;
      }
    }
    return 3;
  }

  let background = "bg transparent";
  let state = getState(row);
  if (state === 1) {
    background = "bg-red-200";
  } else if (state === -1) {
    background = "bg-blue-200";
  } else if (state === 3) {
    background = "bg-gray-200";
  }

  // Corrected destructuring
  return (
    <div className={"grid grid-cols-3 aspect-square border-4 border-gray-700 " + background}>
      {row.map((info, index) => (
        <Cell key={info.id} info={info} update={update} /> // Added key and corrected destructuring
      ))}
    </div>
  );
};

export default Miniboard;
