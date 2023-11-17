import React, { useState, useRef, useEffect } from "react";
import Miniboard from "./components/Miniboard";
import InputSlider from "react-input-slider";

function App() {
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
  const bingos = ["012", "345", "678", "036", "147", "258", "048", "246"];
  const delay = () => new Promise((res) => setTimeout(res, speedRef.current));

  const [game, setGame] = useState(""); // string up to 81 chars
  const [playerColor, setPlayerColor] = useState(220);
  const [opponentColor, setOpponentColor] = useState(0);
  const [turn, setTurn] = useState(0);
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
    let row = 2 - (lastMove % 3);
    let col = Math.floor((lastMove % 27) / 9);
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
      } else {
        setActiveBoard(-1);
      }

      setTurn(2 - 4 * (game.length % 2));
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

    setTurn((turn) => {
      return turn * -1;
    });

    // Wait for the specified timeout before proceeding to the next move
    await delay();
  };

  // remap linear [81] to cell-wise [9][9] state information
  const cells = (input) => {
    let newMap = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        newMap[row][col] = {
          state: input[remapping[row][col]],
          id: remapping[row][col],
          player: {
            icon: playerIcon,
            color: playerColor,
          },
          opponent: {
            icon: opponentIcon,
            color: opponentColor,
          },
        };
      }
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
              settings={{
                playerColor: playerColor,
                opponentColor: opponentColor,
                playerIcon: playerIcon,
                opponentIcon: opponentIcon,
              }}
              update={updateGame}
              winner={getWinner(row)}
              active={{ board: activeBoard === index || activeBoard === -1, turn: turn }}
            />
          ))}
        </div>
        <div>
          Speed:
          <InputSlider className="ml-4" axis="x" x={speed} xmin={50} xmax={1000} onChange={updateSpeed} />
        </div>

        <div>
          Player 1:
          <input type="text" className="w-6 mx-2" value={playerIcon} onChange={(e) => setPlayerIcon(e.target.value)} />
          <InputSlider
            styles={{
              active: {
                backgroundColor: `hsl(${playerColor}, 100%, 50%)`,
              },
            }}
            className="ml-4"
            axis="x"
            x={playerColor}
            xmin={1}
            xmax={360}
            onChange={(val) => setPlayerColor(val.x)}
          />
        </div>
        <div>
          Player 2:
          <input
            type="text"
            className="w-6 mx-2"
            value={opponentIcon}
            onChange={(e) => setOpponentIcon(e.target.value)}
          />
          <InputSlider
            styles={{
              active: {
                backgroundColor: `hsl(${opponentColor}, 100%, 50%)`,
              },
            }}
            className="ml-4"
            axis="x"
            x={opponentColor}
            xmin={1}
            xmax={360}
            onChange={(val) => setOpponentColor(val.x)}
          />
        </div>
        <div>
          <button onClick={run} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
            Run ▶️
          </button>
          <button onClick={reset} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
            Reset 🔁
          </button>
        </div>
        <h2 className="mt-4">Game Data</h2>
        <input type="text" className="border-b-2 w-full" value={game} onChange={(e) => setGame(e.target.value)} />
      </div>
    </div>
  );
}

export default App;
