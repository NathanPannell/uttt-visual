import React, { useState, useRef, useEffect } from "react";
import Miniboard from "./components/Miniboard";
import InputSlider from "react-input-slider";

function App() {
  const remapping = [0, 1, 2, 9, 10, 11, 18, 19, 20];
  const delay = () => new Promise((res) => setTimeout(res, speedRef.current));
  const [game, setGame] = useState(""); // 81 long string
  const [speed, setSpeed] = useState(1000); // 81 long string
  const speedRef = useRef(speed);
  const [state, setState] = useState([]); // 81 long integer array
  const [player, setPlayer] = useState("❌"); // player 1 icon
  const [opponent, setOpponent] = useState("⭕"); // player 2 icon

  useEffect(() => {
    setState((prevState) => {
      let newState = [...prevState];
      let player = 1;

      for (const char of game) {
        let move = char.charCodeAt(0) - 32; // decode char (from ascii)
        newState[move] = player;
        player *= -1; // Toggle player after each move
      }

      return newState;
    });
  }, [game]); // This will call updateState whenever 'game' changes

  const updateGame = (id) => {
    if (!game.includes(id)) {
      setGame(game + id);
    }
  };

  const updateSpeed = (val) => {
    setSpeed(val.x);
    speedRef.current = val.x; // Update the ref whenever the slider changes
  };

  const reset = () => {
    setGame("");
    setState(Array(81).fill(0));
  };

  const run = async (e) => {
    e.preventDefault();
    reset();

    let player = 1; // always start with player 1
    for (const char of game) {
      let move = char.charCodeAt(0) - 32; // decode char (from ascii)
      await playMove(move, player);
      player *= -1; // Toggle player after each move
    }
  };

  const playMove = async (move, player) => {
    // Update board state for the move
    setState((prevState) => {
      let tempBoard = [...prevState];
      tempBoard[move] = player;
      return tempBoard;
    });

    // Wait for the specified timeout before proceeding to the next move
    await delay();
  };

  // remap linear [81] to cell-wise [9][9] state information
  const cells = (input) => {
    let newMap = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let i = 0; i < 81; i++) {
      const row = Math.floor(i / 9);
      const col = i % 9;
      const patternIndex = remapping[col] + 3 * (row % 3) + 27 * Math.floor(row / 3);
      newMap[row][col] = {
        state: input[patternIndex],
        id: String.fromCharCode(patternIndex + 32),
        player: "❌",
        opponent: "⭕",
      };
    }
    return newMap;
  };

  return (
    <div className="App w-full flex justify-center items-center">
      <div className="flex-col my-8">
        <h2 className="mt-4">Game Board</h2>
        <div className="grid grid-cols-3 aspect-square max-h-96 border-8 border-black">
          {cells(state).map((row, index) => (
            <Miniboard key={index} row={row} update={updateGame} />
          ))}
        </div>
        <div className="m-2 gap-4">
          Speed:
          <InputSlider className="ml-4" axis="x" x={speed} xmin={50} xmax={1000} onChange={updateSpeed} />
        </div>
        <div>
          <button onClick={run} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
            Run ▶️
          </button>
          <button onClick={reset} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
            Reset 🔁
          </button>
          <input
            type="text"
            placeholder="❌"
            className="w-6 mx-2"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
          />
          <input
            type="text"
            placeholder="⭕"
            className="w-6 mx-2"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          />
        </div>
        <h2 className="mt-4">Game Data</h2>
        <input type="text" className="border-b-2 w-full" value={game} onChange={(e) => setGame(e.target.value)} />
      </div>
    </div>
  );
}

export default App;
