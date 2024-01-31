import React, { useState, useEffect } from "react";
import MainBoard from "../components/MainBoard";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TextField from "@mui/material/TextField";

function Tournament() {
  /* 
  
	This is the tournament environment for visualizing multiple game strings with an array

	*/

  const [matches, setMatches] = useState();
  const [participants, setParticipants] = useState(); //Use this for getting player names and stuff! See schema in server.js -> filename regex for bot name?
  const [matchData, setMatchData] = useState();
  const [games, setGames] = useState([]);
  const [numberOfGames, setNumberOfGames] = useState(0);
  const [colClassName, setColClassName] = useState("grid grid-cols-4 w-full");

  useEffect(() => {
    matches && participants && createFinalMatchData();
  }, [matches]);

  useEffect(() => {
    matchData &&
      setGames(
        matchData.map((match) => {
          return getWinnerGame(match.match_log);
        })
      );
  }, [matchData]);

  const fetchDataFromServer = async (endpoint, setData) => {
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    fetchDataFromServer("/api/matches", setMatches);
    fetchDataFromServer("/api/participants", setParticipants);
  }, []);

  const createFinalMatchData = () => {
    setMatchData(
      matches.map((match) => {
        return {
          match_id: match.match_id,
          identifier: match.identifier,
          round: match.round,
          player1: participants.find((participant) => participant.player_id === match.player1_id),
          player2: participants.find((participant) => participant.player_id === match.player2_id),
          winner: participants.find((participant) => participant.player_id === match.winner_id),
          match_score: match.match_score,
          match_log: match.match_log,
        };
      })
    );
  };

  function checkNotStale(gameLog) {
    function unconvert(symbol) {
      const offset = 32;
      const intPosition = symbol.charCodeAt(0) - offset;
      return [Math.floor(intPosition / 9), intPosition % 9];
    }

    // fill in markers
    const tempBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let i = 0; i < gameLog.length; i += 2) {
      const symbol = gameLog[i];
      const [row, col] = unconvert(symbol);
      tempBoard[row][col] = 1;
    }

    function checkLine(box) {
      for (let i = 0; i < 3; i++) {
        if (Math.abs(box[i].reduce((acc, val) => acc + val, 0)) === 3) return true; // horizontal
        if (Math.abs(box.map((row) => row[i]).reduce((acc, val) => acc + val, 0)) === 3) return true; // vertical
      }

      // diagonals
      if (Math.abs(box.map((row, i) => row[i]).reduce((acc, val) => acc + val, 0)) === 3) return true;
      if (Math.abs(box.map((row, i) => row[2 - i]).reduce((acc, val) => acc + val, 0)) === 3) return true;
      return false;
    }

    // fill in miniboard wins
    const tempMiniboard = Array.from({ length: 3 }, () => Array(3).fill(0));
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 3; k++) {
        tempMiniboard[i][k] = checkLine(
          tempBoard.slice(i * 3, (i + 1) * 3).map((row) => row.slice(k * 3, (k + 1) * 3))
        );
      }
    }

    return checkLine(tempMiniboard);
  }

  const getWinnerGame = (match_log) => {
    let even = 0;
    let odd = 0;
    match_log.forEach((game) => {
      game.length % 2 === 0 ? (even = even + 1) : (odd = odd + 1);
    });
    if (even > odd) {
      const temp = match_log.filter((game) => game.length % 2 === 0);
      temp.sort((a, b) => b.length - a.length); // reverse sorting, greatest to smallest
      for (let x in temp) {
        // checkNotStale does not work properly
        if (checkNotStale(x)) {
          return x;
        }
      }
      // Returning the largest game that was won or stalemate by the winner
      return temp[0];
    } else {
      const temp = match_log.filter((game) => game.length % 2 !== 0);
      temp.sort((a, b) => b.length - a.length); // reverse sorting, greatest to smallest
      for (let x in temp) {
        if (checkNotStale(x)) {
          return x;
        }
      }
      return temp[0];
    }
  };

  // SETUP GAMES HERE!!

  const [gameStrings, setGameStrings] = useState(Array(games.length).fill("")); // Array of game strings
  const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Dynamic timeout for slowing animation
  const run = async (e) => {
    e.preventDefault();
    console.log(matchData);

    if (numberOfGames === 0 || games.length === 0) return;
    const numberOfGamesToDisplay = numberOfGames > games.length ? games.length : numberOfGames;
    const newGameStrings = Array(numberOfGamesToDisplay).fill("");
    let longestGame = games.slice(0, numberOfGamesToDisplay).reduce(function (a, b) {
      return a.length > b.length ? a : b;
    });
    const gamesToDisplay = games.slice(0, numberOfGamesToDisplay);
    for (let i = 0; i < longestGame.length; i++) {
      // Move index
      for (let j = 0; j < numberOfGamesToDisplay; j++) {
        // Game selected
        newGameStrings[j] += gamesToDisplay[j].length > i ? gamesToDisplay[j][i] : "";
      }

      setGameStrings([...newGameStrings]);
      await delay(1000); // Wait for 1 second
    }
    setGames(popFromFront(numberOfGames, games));
  };

  const popFromFront = (amountToPop, arrToPopFrom) => {
    const temp = [...arrToPopFrom];
    temp.splice(0, amountToPop);
    return temp;
  };

  // Disabled selection temporarily, this will be updated via backend??
  const [playerColor, setPlayerColor] = useState(20);
  const [playerIcon, setPlayerIcon] = useState("🟠");
  const [opponentColor, setOpponentColor] = useState(220);
  const [opponentIcon, setOpponentIcon] = useState("🟦");

  return (
    <div className="App w-full flex-col justify-center items-center">
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        defaultValue={"0"}
        onChange={(e) => {
          setNumberOfGames(parseInt(e.target.value));
        }}
      />
      <Button
        variant="contained"
        endIcon={<NavigateNextIcon />}
        onClick={(e) => {
          setColClassName(`grid grid-cols-${numberOfGames > 4 ? 4 : numberOfGames} w-full`);
          run(e);
        }}
        type="submit"
        className="mr-2 bg-slate-100 p-2 rounded-lg"
      >
        Run
      </Button>
      <div className={colClassName}>
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
