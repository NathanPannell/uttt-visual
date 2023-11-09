import React, { useState } from "react";
import Miniboard from "./components/Miniboard";

function App() {
  const remapping = [0, 1, 2, 9, 10, 11, 18, 19, 20];
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const TIMEOUT = 1000;
  const [input, setInput] = useState("");
  const [game, setGame] = useState("");

  const parseGame = (e) => {
    setGame(e.target.value.replace(/[^012,]/g, ""));
  };

  const parseSingle = (e) => {
    setInput(e.target.value.replace(/[^012]/g, ""));
  };

  const runGame = async (e) => {
    e.preventDefault();
    let states = game.split(",");
    for (const state of states) {
      setInput(state);
      await delay(TIMEOUT); // Await the delay before continuing the loop
    }
  };

  const cells = (input) => {
    let newMap = Array.from({ length: 9 }, () => Array(9).fill(0));

    for (let i = 0; i < 81; i++) {
      // Remapping from linear (top left to top right) to cell-wise array (2D)
      const row = Math.floor(i / 9);
      const col = i % 9;
      const patternIndex = remapping[col] + 3 * (row % 3) + 27 * Math.floor(row / 3);

      newMap[row][col] = input[patternIndex];
    }

    return newMap;
  };

  return (
    <div className="App w-full flex justify-center items-center">
      <div className="flex-col my-8">
        <h2 className="mt-4">Game Board:</h2>
        <div className="grid grid-cols-3 aspect-square max-h-96 border-8 border-black">
          {cells(input).map((row, index) => (
            <Miniboard key={index} row={row} />
          ))}
        </div>
        <h2 className="mt-4">Input Game Data:</h2>
        <input
          type="text"
          placeholder="Single State: 001012..."
          className="border-b-2 w-full my-2"
          onChange={parseSingle}
        />
        <form onSubmit={runGame} className="flex">
          <button type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
            Submit
          </button>
          <input
            type="text"
            placeholder="Full Game: 001...,101...,..."
            className="border-b-2 w-full"
            onChange={parseGame}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
