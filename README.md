# UTTT Visualization

Live website at: https://uttt-visual.vercel.app/

## Features

1. Clickable Board: Click on the '🟥' (representing possible moves) to make a move, notice that your moves are recorded as ASCII text in the bottom bar.

2. Replay Game: With a loaded game in the 'Game Data' section, press the 'Run ▶️' button to play the game with an animation. Use slider to control speed.

3. Customizable Icons: The '❌' and '⭕' buttons can be replaced with any character (especially emojis 💃). This character will be used to mark your moves.

## Character mapping

The game data represents the sequence of actions taken using a unique ASCII character per cell. The order of the characters represents the order of the moves taken.

Characters used:

```
!"#$%&'()\*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^\_`abcdefghijklmnop
```

Mapping from the game board to an integer [0,80] or ASCII character encoding:

```python
# Get index value for individual cell
index = cell.column + 9 * cell.row

# Generate list of characters
chars = [chr(i + 32) for i in range(81)]

# Decode characters -> numbers
nums = [ord(char) - 32 for char in chars]
```

## Tournament mode

The text field is the input for how many games to display at a time. For best results, input 1, 2, 3, 4 or 8 only. After inputting, click the run button to show the games.

## Required installs

Using npm or yarn, install the following -
concurrently, @mui/material, @emotion/react, @emotion/styled, express, mongoose, @mui/icons-material  
(or run npm ci or npm i if using npm)
