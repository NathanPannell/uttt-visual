import React, { useState, useEffect } from "react";
import MainBoard from "../components/MainBoard";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TextField from "@mui/material/TextField";

function Tournament() {
  /* 
  
	This is the tournament environment for visualizing multiple game strings with an array

	*/

  const [participants, setParticipants] = useState(); //Use this for getting player names and stuff! See schema in server.js -> filename regex for bot name?
  const [matches, setMatches] = useState();
  const [matchData, setMatchData] = useState();
  const [games, setGames] = useState([]);
  const [gameData, setGameData] = useState([]); //Corresponding array where each index has the match's data for each index (game string) in the games array
  const [numberOfGames, setNumberOfGames] = useState(8);
  const [havePopped, setHavePopped] = useState(false);
  const [colClassName, setColClassName] = useState("grid grid-cols-4 w-full items-center");

  useEffect(() => {
    matches && participants && createFinalMatchData();
  }, [matches]);

  useEffect(() => {
    matchData &&
      setGames(
        matchData.map((match) => {
          /*
          game = {
            gameString = "adasdasdasd",
            first_player = [1,2],
            game_index = [0,9],
            p1_wins
          }
          */
          return getWinnerGame(match.match_log, match.player1 === match.winner ? 1 : 2);
        })
      );
    matchData &&
      setGameData(
        matchData.map((match) => {
          return {
            player1_emoji: match.player1.player_emoji,
            player1_bg_color: match.player1.player_bg_color,
            player1_name:
              match.player1.file_name.length >= 20
                ? match.player1.file_name.slice(0, 17) + "..."
                : match.player1.file_name,
            player2_emoji: match.player2.player_emoji,
            player2_bg_color: match.player2.player_bg_color,
            player2_name:
              match.player2.file_name.length >= 20
                ? match.player2.file_name.slice(0, 17) + "..."
                : match.player2.file_name,
          };
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
          return row[a]; // Winner found
        }
      }
      return 0;
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

  const getWinnerGame = (match_log, winning_player) => {
    let gameString = "";
    let first_player = 0;
    let game_index = 1;

    const p1_wins = winning_player === 1;

    for (let i = 0; i < 10; i++) {
      const tempGameString = match_log[i];
      if ((p1_wins && i % 2 !== tempGameString.length % 2) || (!p1_wins && i % 2 === tempGameString.length % 2)) {
        if (gameHasWinner(tempGameString) && tempGameString.length > gameString.length) {
          gameString = tempGameString;
          game_index = i;
          first_player = 1 + (game_index % 2);
        }
      }
    }
    return {
      gameString,
      first_player,
      game_index,
      p1_wins,
    };
  };

  const [gameStrings, setGameStrings] = useState(Array(games.length).fill("")); // Array of game strings
  const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // Dynamic timeout for slowing animation
  const run = async (e) => {
    e.preventDefault();
    console.log(matchData, games, gameData);

    let newGameData;
    let newGames;

    if (havePopped) {
      newGameData = popFromFront(numberOfGames, gameData);
      newGames = popFromFront(numberOfGames, games);
      setGameData(newGameData);
      setGames(newGames);
    } else {
      newGameData = gameData;
      newGames = games;
      setHavePopped(true);
    }

    if (numberOfGames === 0 || newGames.length === 0) return;
    const numberOfGamesToDisplay = numberOfGames > newGames.length ? newGames.length : numberOfGames;
    const newGameStrings = Array(numberOfGamesToDisplay).fill("");
    const gamesToDisplay = newGames
      .map((game) => {
        return game.gameString;
      })
      .slice(0, numberOfGamesToDisplay);
    let longestGame = gamesToDisplay.reduce(function (a, b) {
      return a.length > b.length ? a : b;
    });
    for (let i = 0; i < longestGame.length; i++) {
      for (let j = 0; j < numberOfGamesToDisplay; j++) {
        newGameStrings[j] += gamesToDisplay[j].length > i ? gamesToDisplay[j][i] : "";
      }
      setGameStrings([...newGameStrings]);

      if (i >= 4) {
        await delay(300); // Wait for 1 second after playing first 4 moves
      }
    }
  };

  const popFromFront = (amountToPop, arrToPopFrom) => {
    const temp = [...arrToPopFrom];
    temp.splice(0, amountToPop);
    return temp;
  };

  return (
    <div className="App w-full flex-col justify-center items-center">
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
          setColClassName(`grid grid-cols-${numberOfGames > 4 ? Math.round(numberOfGames / 2) : numberOfGames} w-full`);
          run(e);
        }}
        type="submit"
        className="mr-2 bg-slate-100 p-2 rounded-lg"
      >
        Run
      </Button>
      <Button onClick={() => console.log(participants)} endIcon={<NavigateNextIcon />} />
      <div className="grid grid-cols-4 w-full">
        {gameStrings.map((gameString, index) => {
          const first_player = games[index].first_player;
          const options =
            first_player === 1
              ? {
                  player: {
                    color: gameData[index].player1_bg_color,
                    icon: gameData[index].player1_emoji,
                  },
                  opponent: {
                    color: gameData[index].player2_bg_color,
                    icon: gameData[index].player2_emoji,
                  },
                }
              : {
                  opponent: {
                    color: gameData[index].player1_bg_color,
                    icon: gameData[index].player1_emoji,
                  },
                  player: {
                    color: gameData[index].player2_bg_color,
                    icon: gameData[index].player2_emoji,
                  },
                };

          const game_over = gameString === games[index].gameString;
          let title;
          if (!game_over) {
            title = (
              <h2 className="text-center mb-2">
                {gameData[index].player1_name} ({gameData[index].player1_emoji}) vs. {gameData[index].player2_name} (
                {gameData[index].player2_emoji})
              </h2>
            );
          } else if (games[index].p1_wins) {
            title = (
              <h2 className="text-center mb-2">
                <b>
                  {gameData[index].player1_name} ({gameData[index].player1_emoji})
                </b>{" "}
                vs. {gameData[index].player2_name} ({gameData[index].player2_emoji})
              </h2>
            );
          } else {
            title = (
              <h2 className="text-center mb-2">
                {gameData[index].player1_name} ({gameData[index].player1_emoji}) vs.{" "}
                <b>
                  {gameData[index].player2_name} ({gameData[index].player2_emoji})
                </b>
              </h2>
            );
          }

          return (
            <div className="flex flex-col items-center justify-center my-4 w-full">
              {title}
              <MainBoard key={index} update={() => {}} gameString={gameString} options={options} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tournament;
