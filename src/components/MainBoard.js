import React, { useState, useEffect } from "react";
import Miniboard from "./Miniboard";

function MainBoard({ options }) {
  const delay = () => new Promise((res) => setTimeout(res, 1.5 ** (19 - options.speedRef.current / 10)));

  // interior borders for game board
  const getBorderStyle = (index) => ({
    borderR: index % 3 < 2 ? "black" : "transparent",
    borderL: index % 3 > 0 ? "black" : "transparent",
    borderB: index < 6 ? "black" : "transparent",
    borderT: index > 2 ? "black" : "transparent",
  });

  // winning combinations on a [9] based board
  const getWinner = (row) => {
    const bingos = ["012", "345", "678", "036", "147", "258", "048", "246"];
    for (const bingo of bingos) {
      const [a, b, c] = bingo.split("").map((index) => row[index].cellState);
      if (a && a === b && a === c) {
        return a; // Winner found
      }
    }
    return row.every((cell) => cell.cellState) ? 2 : 0; // 2 for stalemate, 0 for open (game continues)
  };

  // active board determines legal moves
  const [activeBoard, setActiveBoard] = useState(-1); // -1 if all boards are active
  const [turn, setTurn] = useState(0); // 1 for player, -1 for opponent
  const getActiveBoard = (board, move) => {
    let row = 2 - (move % 3);
    let col = Math.floor((move % 27) / 9);
    let index = col + 3 * row;

    if (getWinner(cells(board)[index]) !== 0) {
      setActiveBoard(-1);
    } else {
      setActiveBoard(index);
    }
  };

  const [game, setGame] = useState(""); // sequence of ASCII characters representing moves
  const [state, setState] = useState(Array(81).fill(0)); // [81] array of cell states
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
      } else {
        setActiveBoard(-1);
      }

      setTurn(1 - 2 * (game.length % 2));
      return newState;
    });
  }, [game]); // update board when string changes

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
    setGame((game) => {
      return game + String.fromCharCode(move + 32);
    });

    await delay();
  };

  // remap linear [81] to cell-wise [9][9] state information
  const cells = (input) => {
    const remapping = [
      [8, 17, 26, 7, 16, 25, 6, 15, 24],
      [35, 44, 53, 34, 43, 52, 33, 42, 51],
      [62, 71, 80, 61, 70, 79, 60, 69, 78],
      [5, 14, 23, 4, 13, 22, 3, 12, 21],
      [32, 41, 50, 31, 40, 49, 30, 39, 48],
      [59, 68, 77, 58, 67, 76, 57, 66, 75],
      [2, 11, 20, 1, 10, 19, 0, 9, 18],
      [29, 38, 47, 28, 37, 46, 27, 36, 45],
      [56, 65, 74, 55, 64, 73, 54, 63, 72],
    ];

    let newMap = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        newMap[row][col] = {
          cellState: input[remapping[row][col]],
          id: remapping[row][col],
        };
      }
    }
    return newMap;
  };

  const update = (id) => {
    let char = String.fromCharCode(id + 32);
    setGame(game + char);
  };

  return (
    <>
      <div className="grid grid-cols-3 aspect-square max-h-96">
        {cells(state).map((row, index) => {
          const { borderR, borderL, borderB, borderT } = getBorderStyle(index);

          return (
            <Miniboard
              key={index}
              customization={options}
              update={update}
              info={{
                winner: getWinner(row),
                row: row,
                active: activeBoard === index || activeBoard === -1,
                turn: turn,
              }}
              borders={`border-2 border-r-${borderR} border-l-${borderL} border-b-${borderB} border-t-${borderT}`}
            />
          );
        })}
      </div>
      <div>
        <button onClick={run} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
          Run ▶️
        </button>
        <button onClick={reset} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
          Reset 🔁
        </button>
      </div>
      <h2 className="mt-4">Game History</h2>
      <input type="text" className="border-b-2 w-full" value={game} onChange={(e) => setGame(e.target.value)} />
    </>
  );
}

export default MainBoard;
