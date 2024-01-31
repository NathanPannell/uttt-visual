const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 3001;

app.use(express.json());

const uri = "mongodb+srv://UTTTuser1:UTTTuser1@utttcluster.8na1d4l.mongodb.net/UTTTBracket?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Mongoose schema for Matches
const matchSchema = new mongoose.Schema({
  _id: String,
  match_id: Number,
  round: Number,
  identifier: String,
  player1_id: Number,
  player2_id: Number,
  winner_id: Number,
  match_score: String,
  match_log: [String],
});

// Mongoose model for Matches
const Match = mongoose.model("Match", matchSchema, "Matches");

// Mongoose schema for Participants
const participantSchema = new mongoose.Schema({
  _id: Number,
  player_id: Number,
  name: String,
  file_name: String,
});

// Mongoose model for Participants
const Participant = mongoose.model("Participant", participantSchema, "Participants");

db.once("open", () => {
  console.log("Connected to MongoDB");
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await Match.find({});
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/participants", async (req, res) => {
    try {
      const participants = await Participant.find();
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
