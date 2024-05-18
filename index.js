document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const totalScorePointsSpan = document.getElementById("total");
  const buttons = document.querySelectorAll(".keyboard button");

  const PD = {
    A: 5,
    E: 5,
    L: 5,
    N: 5,
    R: 5,
    S: 5,
    T: 5,
    H: 4,
    I: 4,
    O: 4,
    C: 3,
    D: 3,
    P: 3,
    U: 3,
    Y: 3,
    B: 2,
    W: 2,
    F: 2,
    G: 2,
    J: 2,
    K: 2,
    M: 2,
    Q: 1,
    V: 1,
    X: 1,
    Z: 1,
  };

  const RD = 10; // round index multiplier

  const wordLength = 5;
  const maxGuesses = 6;
  const currentYear = new Date().getFullYear();
  const seed = currentYear;

  let wordOfTheDay = "";
  let currentGuess = "";
  let round = 0;
  let total = 0;
  let firstWordPoints = 0;
  let acceptableWords = new Set();

  // Load the word lists
  let wordleLA = [];
  let wordleTA = [];

  fetch(
    "https://gist.githubusercontent.com/scholtes/94f3c0303ba6a7768b47583aff36654d/raw/d9cddf5e16140df9e14f19c2de76a0ef36fd2748/wordle-La.txt"
  )
    .then((response) => response.text())
    .then((data) => {
      wordleLA = data.split("\n").filter((word) => word.length === wordLength);
      wordleLA.forEach((word) =>
        acceptableWords.add(word.trim().toUpperCase())
      );
      wordOfTheDay = getWordOfTheDay();
      wordOfTheDay = wordOfTheDay.toLocaleUpperCase(); // Assign the result back to wordOfTheDay
    });

  fetch(
    "https://gist.githubusercontent.com/scholtes/94f3c0303ba6a7768b47583aff36654d/raw/d9cddf5e16140df9e14f19c2de76a0ef36fd2748/wordle-Ta.txt"
  )
    .then((response) => response.text())
    .then((data) => {
      wordleTA = data.split("\n").filter((word) => word.length === wordLength);
      wordleTA.forEach((word) =>
        acceptableWords.add(word.trim().toUpperCase())
      );
    });

  function getWordOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );
    const uniqueIndices = generateUniqueIndices(
      currentYear,
      wordleLA.length,
      365
    );
    return wordleLA[uniqueIndices[dayOfYear]];
  }

  function generateUniqueIndices(seed, length, count) {
    const indices = new Set();
    let i = 0;
    while (indices.size < count) {
      const index = Math.floor(
        (Math.abs(Math.sin(seed + i) + Math.cos(seed + i)) * 100000) % length
      );
      indices.add(index);
      i++;
    }
    return Array.from(indices);
  }

  function createGrid() {
    for (let i = 0; i < wordLength * maxGuesses; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
    }
  }

  function updateGrid() {
    const cells = grid.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      const row = Math.floor(index / wordLength);
      const col = index % wordLength;
      if (currentGuess.length > col && round === row) {
        cell.textContent = currentGuess[col];
      } else if (row < round) {
        // Keep the letters from previous guesses
      } else {
        cell.textContent = "";
      }
    });
  }

  function handleInput(letter) {
    if (letter === "<<<") {
      currentGuess = currentGuess.slice(0, -1);
    } else if (letter === "Enter") {
      if (currentGuess.length === wordLength) {
        if (acceptableWords.has(currentGuess.toUpperCase())) {
          checkGuess();
          if (round === 0) {
            firstWordPoints = calculateScore(currentGuess);
          }
          if (currentGuess.toUpperCase() === wordOfTheDay) {
            total = firstWordPoints + round * RD;
            alert(`Congratulations! You guessed the word: ${wordOfTheDay}. Your total score is: ${total}`);
            return; // End the game
          } else {
            if (round < 5) {
              total = firstWordPoints + round * RD;
              round++;
            } else {
              total = firstWordPoints + 60;
              alert(`Game Over! The correct word was: ${wordOfTheDay}. Your total score is: ${total}`);
              return; // End the game
            }
          }
          currentGuess = "";
        } else {
          alert("Not a valid word");
        }
      }
    } else if (currentGuess.length < wordLength) {
      currentGuess += letter;
    }
    updateGrid();
    totalScorePointsSpan.textContent = total.toString().padStart(1, "0");
  }
  

  function calculateScore(word) {
    return word.split("").reduce((score, letter) => {
      return score + (PD[letter.toUpperCase()] || 0);
    }, 0);
  }

  function checkGuess() {
    const cells = grid.querySelectorAll(".cell");
    const guessLetters = currentGuess.split("");
    const wordLetters = wordOfTheDay.split("");
    const buttonColors = {}; // Object to store button colors

    // First pass: check for correct positions (green)
    guessLetters.forEach((letter, index) => {
      const cellIndex = round * wordLength + index;
      const cell = cells[cellIndex];

      if (letter === wordLetters[index]) {
        cell.style.backgroundColor = "green";
        wordLetters[index] = null; // Remove the letter from word to avoid double counting
        buttonColors[letter.toUpperCase()] = "green";
      }
    });

    // Second pass: check for wrong positions (yellow)
    guessLetters.forEach((letter, index) => {
      const cellIndex = round * wordLength + index;
      const cell = cells[cellIndex];

      if (
        wordLetters.includes(letter) &&
        cell.style.backgroundColor !== "green"
      ) {
        cell.style.backgroundColor = "#dac316";
        wordLetters[wordLetters.indexOf(letter)] = null; // Remove the letter from word to avoid double counting
        if (!buttonColors[letter.toUpperCase()]) {
          buttonColors[letter.toUpperCase()] = "#dac316";
        }
      } else {
        if (
          cell.style.backgroundColor !== "green" &&
          cell.style.backgroundColor !== "#dac316"
        ) {
          cell.style.backgroundColor = "#636363";
          if (!buttonColors[letter.toUpperCase()]) {
            buttonColors[letter.toUpperCase()] = "#636363";
          }
        }
      }
    });

    // Update button colors based on guesses
    updateButtonColors(buttonColors);
  }

  function updateButtonColors(buttonColors) {
    buttons.forEach((button) => {
      const letter = button.textContent.toUpperCase();
      if (buttonColors[letter]) {
        button.style.backgroundColor = buttonColors[letter];
      }
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => handleInput(button.textContent));
  });

  createGrid();
  updateGrid();
});
