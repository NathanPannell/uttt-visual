import React, { useState, useRef } from "react";
import InputSlider from "react-input-slider";
import MainBoard from "./MainBoard";

function Game() {
  // controls pace of animation
  const [speed, setSpeed] = useState(1000);
  const speedRef = useRef(speed);
  const updateSpeed = (val) => {
    setSpeed(val.x);
    speedRef.current = val.x;
  };

  // customization options
  const [playerColor, setPlayerColor] = useState(220);
  const [playerIcon, setPlayerIcon] = useState("❌");
  const [opponentColor, setOpponentColor] = useState(0);
  const [opponentIcon, setOpponentIcon] = useState("⭕");

  return (
    <div className="App w-full flex justify-center items-center">
      <div className="flex-col my-8">
        <MainBoard
          options={{
            player: {
              color: playerColor,
              icon: playerIcon,
            },
            opponent: {
              color: opponentColor,
              icon: opponentIcon,
            },
            speedRef: speedRef,
          }}
        />
        <div>
          Speed:
          <InputSlider className="ml-4" axis="x" x={speed} xmin={50} xmax={2000} onChange={updateSpeed} />
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

export default Game;
