import React from "react";
import Cell from "./Cell";

const Miniboard = ({ row }) => {
  const bingos = ["012", "345", "678", "036", "147", "258", "048", "246"];

  function getState(row) {
    for (const bingo of bingos) {
      if (row[bingo[0]] > 0 && row[bingo[0]] == row[bingo[1]] && row[bingo[1]] == row[bingo[2]]) {
        return row[bingo[0]];
      }
    }

    for (let i = 0; i < 9; i++) {
      console.log(row[i]);
      if (row[i] == 0 || row[i] == undefined) {
        return 0;
      }
    }
    return 3;
  }

  let background = "bg transparent";
  let state = getState(row);
  if (state == 1) {
    background = "bg-red-200";
  } else if (state == 2) {
    background = "bg-blue-200";
  } else if (state == 3) {
    background = "bg-gray-200";
  }

  // Corrected destructuring
  return (
    <div className={"grid grid-cols-3 aspect-square border-4 border-gray-700 " + background}>
      {row.map((state, index) => (
        <Cell key={index} state={state} /> // Added key and corrected destructuring
      ))}
    </div>
  );
};

export default Miniboard;
