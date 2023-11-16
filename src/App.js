import React, { useState, useRef, useEffect } from "react";
import Miniboard from "./components/Miniboard";
import InputSlider from "react-input-slider";

function App() {
  const remapping = [0, 1, 2, 9, 10, 11, 18, 19, 20];
  const bingos = ["012", "345", "678", "036", "147", "258", "048", "246"];
  const delay = () => new Promise((res) => setTimeout(res, speedRef.current));

  const [game, setGame] = useState(""); // string up to 81 chars
  const [speed, setSpeed] = useState(1000); // speed when running game
  const speedRef = useRef(speed);
  const [state, setState] = useState([]); // array up to 81 objects
  const [activeBoard, setActiveBoard] = useState(-1); // -1 if all boards are active
  const [playerIcon, setPlayerIcon] = useState("❌"); // player 1 icon
  const [opponentIcon, setOpponentIcon] = useState("⭕"); // player 2 icon

  const getWinner = (row) => {
    for (const bingo of bingos) {
      if (
        row[bingo[0]].state !== 0 &&
        row[bingo[0]].state !== undefined &&
        row[bingo[0]].state === row[bingo[1]].state &&
        row[bingo[1]].state === row[bingo[2]].state
      ) {
        return row[bingo[0]].state; // decided
      }
    }
    for (let i = 0; i < 9; i++) {
      if (row[i].state === 0 || row[i].state === undefined) {
        return 0; // open
      }
    }
    return 2; // stalemate
  };

  const getActiveBoard = (board, lastMove) => {
    let col = lastMove % 3;
    let row = Math.floor((lastMove % 27) / 9);
    let boardIndex = col + 3 * row;

    if (getWinner(cells(board)[boardIndex]) !== 0) {
      setActiveBoard(-1);
    } else {
      setActiveBoard(boardIndex);
    }
  };

  useEffect(() => {
    setState(() => {
      let newState = Array(81).fill(0);
      let player = 1;

      for (const char of game) {
        let move = char.charCodeAt(0) - 32; // decode char (from ASCII)
        newState[move] = player;
        player *= -1; // switch player after each move
      }

      if (game.length > 0) {
        let lastMove = game[game.length - 1].charCodeAt(0) - 32;
        getActiveBoard(newState, lastMove);
      }
      return newState;
    });
  }, [game]); // update board when string changes

  const updateGame = (id) => {
    let char = String.fromCharCode(id + 32);
    setGame(game + char);
  };

  const updateSpeed = (val) => {
    setSpeed(val.x);
    speedRef.current = val.x; // Update the ref whenever the slider changes
  };

  const reset = () => {
    setGame("");
    setState(Array(81).fill(0));
    setActiveBoard(-1);
  };

  const run = async (e) => {
    e.preventDefault();
    reset();
    let tempGame = game;

    let player = 1; // always start with player 1
    for (const char of tempGame) {
      let move = char.charCodeAt(0) - 32; // decode char (from ascii)
      await playMove(move, player);
      player *= -1; // Toggle player after each move
    }

    setGame(tempGame);
  };

  const playMove = async (move, player) => {
    // Update board state for the move
    let tempBoard;
    setState((prevState) => {
      tempBoard = [...prevState];
      tempBoard[move] = player;
      getActiveBoard(tempBoard, move);
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
        id: patternIndex,
        player: playerIcon,
        opponent: opponentIcon,
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
            <Miniboard
              key={index}
              row={row}
              update={updateGame}
              winner={getWinner(row)}
              active={activeBoard === index || activeBoard === -1}
            />
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
          <input type="text" className="w-6 mx-2" value={playerIcon} onChange={(e) => setPlayerIcon(e.target.value)} />
          <input
            type="text"
            className="w-6 mx-2"
            value={opponentIcon}
            onChange={(e) => setOpponentIcon(e.target.value)}
          />
        </div>
        <h2 className="mt-4">Game Data</h2>
        <input type="text" className="border-b-2 w-full" value={game} onChange={(e) => setGame(e.target.value)} />
      </div>
    </div>
  );
}

export default App;
