import React, { useState, useRef } from "react";
import InputSlider from "react-input-slider";
import MainBoard from "../components/MainBoard";

function TestEnv() {
  /* 
  
  This is the test environment for visualizing games via a game string

  Controls the following metadata
  - Game control buttons (Start/Pause/Stop/Reset)
  - Input field (Game String)
  - Animation speed slider
  - Player customization input (Color/Icon)

  */

  // State Control
  // const [gameState, setGameState] = useState("empty");

  // Game String
  const [gameString, setGameString] = useState("");
  const update = (id) => {
    let char = String.fromCharCode(id + 32);
    setGameString(gameString + char);
  };

  // Animation speed control
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(speed); // Needed for updates in async functions
  const updateSpeed = (sliderPosition) => {
    setSpeed(sliderPosition.x);
    speedRef.current = sliderPosition.x;
  };
  const delay = () => new Promise((res) => setTimeout(res, 1.5 ** (19 - speedRef.current / 10)));

  const run = async (e) => {
    e.preventDefault();
    let tempGameString = gameString;
    setGameString("");

    let player = 1; // always start with player 1
    for (const char of tempGameString) {
      let move = char.charCodeAt(0) - 32; // decode char (from ascii)
      await playMove(move, player);
      player *= -1; // Toggle player after each move
    }

    setGameString(tempGameString);
  };

  // This could likely be optimized
  const playMove = async (move) => {
    // Update board state for the move
    setGameString((gameString) => {
      return gameString + String.fromCharCode(move + 32);
    });

    await delay();
  };

  // Customization options (color and icon)
  const [playerColor, setPlayerColor] = useState(20);
  const [playerIcon, setPlayerIcon] = useState("🟠");
  const [opponentColor, setOpponentColor] = useState(220);
  const [opponentIcon, setOpponentIcon] = useState("🟦");

  return (
    <div className="App w-full flex justify-center items-center">
      <div className="flex-col my-8">
        <MainBoard
          update={update}
          gameString={gameString}
          options={{
            player: {
              color: playerColor,
              icon: playerIcon,
            },
            opponent: {
              color: opponentColor,
              icon: opponentIcon,
            },
          }}
        />
        <div>
          <button onClick={run} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
            Run ▶️
          </button>
        </div>
        <h2 className="mt-4">Game History</h2>
        <input
          type="text"
          className="border-b-2 w-full"
          value={gameString}
          onChange={(e) => setGameString(e.target.value)}
        />
        <div>
          Speed:
          <InputSlider className="ml-4" axis="x" x={speed} xmin={0} xmax={100} onChange={updateSpeed} />
        </div>
        <div>
          Player 1:
          <input
            type="text"
            className="w-8 m-2 text-xl border-2 rounded-md"
            value={playerIcon}
            onChange={(e) => setPlayerIcon(e.target.value)}
          />
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
            className="w-8 m-2 text-xl border-2 rounded-md"
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
      </div>
    </div>
  );
}

export default TestEnv;
