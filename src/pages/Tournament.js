import React, { useState } from "react";
import MainBoard from "../components/MainBoard";

function Tournament() {
  /* 
  
  This is the tournament environment for visualizing multiple game strings with an array

  */

  // SETUP GAMES HERE!!
  const games = ["abcdef", "ABC", "123", "abc", "ABC", "abcdef", "ABC", "123"];

  const [gameStrings, setGameStrings] = useState(Array(games.length).fill("")); // Array of game strings
  const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Dynamic timeout for slowing animation
  const run = async (e) => {
    e.preventDefault();

    // Clear games and feed character by character
    const newGameStrings = Array(games.length).fill("");
    let longestGame = games.reduce(function (a, b) {
      return a.length > b.length ? a : b;
    });

    for (let i = 0; i < longestGame.length; i++) {
      // Move index
      for (let j = 0; j < games.length; j++) {
        // Game selected
        newGameStrings[j] += games[j].length > i ? games[j][i] : "";
      }

      setGameStrings([...newGameStrings]);
      console.log(newGameStrings);
      await delay(1000); // Wait for 1 second
    }
  };

  // Disabled selection temporarily, this will be updated via backend??
  const [playerColor, setPlayerColor] = useState(20);
  const [playerIcon, setPlayerIcon] = useState("🟠");
  const [opponentColor, setOpponentColor] = useState(220);
  const [opponentIcon, setOpponentIcon] = useState("🟦");

  return (
    <div className="App w-full flex-col justify-center items-center">
      <button onClick={run} type="submit" className="mr-2 bg-slate-100 p-2 rounded-lg">
        Run ▶️
      </button>
      {/* Change grid-col-x to whatever is needed */}
      <div className="grid grid-cols-4 w-full">
        {gameStrings.map((gameString, index) => {
          return (
            <div className="flex-col my-8">
              <MainBoard
                key={index}
                update={() => {}}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tournament;
