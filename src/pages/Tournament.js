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
  const [participants, setParticipants] = useState();
  const [matchData, setMatchData] = useState();
  const [participantData, setParticipantData] = useState();
  const [games, setGames] = useState([]); // (gameString, is player1 going first)
  const [numberOfGames, setNumberOfGames] = useState(8);
  const [colClassName, setColClassName] = useState("grid grid-cols-4 w-full");

  useEffect(() => {
    matches && participants && (createFinalMatchData() || createFinalParticipantData());
  }, [matches]);

  useEffect(() => {
    matchData &&
      setGames(
        matchData.map((match) => {
          return getWinnerGame(match.match_log, match.winner == match.player1);
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

  const createFinalParticipantData = () => {
    setParticipantData(
      participants.map((p) => {
        return {
          player_id: p.player_id,
          player_name: p.file_name,
          bot_name: p.name,
        };
      })
    );
  };

  function gameHasWinner(gameLog) {
    function unconvert(symbol) {
      const offset = 32;
      const intPosition = symbol.charCodeAt(0) - offset;
      return [Math.floor(intPosition / 9), intPosition % 9];
    }

    // fill in both players markers
    const tempBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    let player = 1;
    for (let i = 0; i < gameLog.length; i++) {
      const symbol = gameLog[i];
      const [row, col] = unconvert(symbol);
      tempBoard[row][col] = player;
      player *= -1;
    }

    function checkLine(box) {
      const bingos = ["012", "345", "678", "036", "147", "258", "048", "246"];
      const row = box.flat();
      for (const bingo of bingos) {
        const [a, b, c] = bingo.split("").map((num) => parseFloat(num));
        if (row[a] && row[a] === row[b] && row[b] === row[c]) {
          return true; // Winner found
        }
      }
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

  const getWinnerGame = (match_log, p1_wins) => {
    let result_game = "";
    let p1_going_first = null;
    for (let i = 0; i < 10; i++) {
      const gameString = match_log[i];
      if ((p1_wins && i % 2 != gameString.length % 2) || (!p1_wins && i % 2 == gameString.length % 2)) {
        if (gameHasWinner(gameString) && gameString.length > result_game.length) {
          result_game = gameString;
          p1_going_first = i % 2;
        }
      }
    }
    return [result_game, p1_going_first];
  };

  const [gameStrings, setGameStrings] = useState(Array(games.length).fill("")); // Array of game strings
  const [activePlayers, setActivePlayers] = useState(Array(games.length).fill({}));
  const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Dynamic timeout for slowing animation
  const run = async (e) => {
    e.preventDefault();
    console.log(games);
  };

  const run1 = async (e) => {
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
      if (i > 3) {
        // Start with 4 moves on the board
        await delay(1000); // Wait for 1 second
      }
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
    <div className="App w-full flex-col justify-center items-center m-4 gap-4">
      <h1>Round 1</h1>
      <TextField
        id="outlined-basic"
        variant="outlined"
        defaultValue={"8"}
        onChange={(e) => {
          setNumberOfGames(parseInt(e.target.value));
        }}
      />
      <Button
        variant="contained"
        endIcon={<NavigateNextIcon />}
        onClick={(e) => {
          setColClassName(`grid grid-cols-${numberOfGames > 3 ? Math.ceil(numberOfGames / 2) : numberOfGames} w-full`);
          run(e);
        }}
        type="submit"
      >
        Run
      </Button>
      <div className={colClassName}>
        {gameStrings.map((gameString, index) => {
          return (
            <div className="my-8 flex-col">
              <h2 className="text-center">Adrian Chase... vs. Tyler Allan...</h2>
              <div className="text-center">
                <MainBoard
                  key={index}
                  update={() => {}}
                  gameString={gameStrings[index]}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tournament;
