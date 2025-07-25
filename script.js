const board = Array(9).fill(null);
let isXNext = true;
let playerScore = 0;
let botScore = 0;
let timer = 0;
let timerInterval = null;
let targetWins = 3;

const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const playerScoreEl = document.getElementById("player-score");
const botScoreEl = document.getElementById("bot-score");
const timerEl = document.getElementById("timer");
const nameForm = document.getElementById("name-form");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  document.getElementById("mode-select").classList.remove("hidden");
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    targetWins = parseInt(btn.getAttribute("data-wins"));
    document.getElementById("mode-select").classList.add("hidden");
    gameContainer.classList.remove("hidden");
    resetAll();
    startTimer();
    renderBoard();
  });
});

function startTimer() {
  timer = 0;
  timerEl.textContent = timer;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function renderBoard() {
  gameBoard.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.addEventListener("click", () => handlePlayerClick(index));
    if (cell) {
      const img = document.createElement("img");
      img.src = `assets/${cell === "X" ? "x.png" : "o.png"}`;
      img.alt = cell;
      div.appendChild(img);
    }
    gameBoard.appendChild(div);
  });

  const winner = checkWinner();
  if (winner) {
    statusText.textContent = winner === "X" ? "You win this round!" : "Bot wins this round!";
    updateScore(winner);
  } else if (board.every(cell => cell)) {
    statusText.textContent = "Draw!";
    setTimeout(resetRound, 1500);
  } else {
    statusText.textContent = "Your turn";
  }
}

function handlePlayerClick(index) {
    if (!canClick || board[index] || checkWinner()) return;
    
    board[index] = "X";
    canClick = false;  // блокируем пока не сходил бот
    renderBoard();
  
    if (!checkWinner() && board.includes(null)) {
      setTimeout(botMove, 500);
    } else {
      canClick = true; // если победа или ничья — снова разрешим
    }
  }
  

function botMove() {
  let emptyIndexes = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
  let move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  board[move] = "O";
  renderBoard();
}

function checkWinner() {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function updateScore(winner) {
  if (winner === "X") playerScore++;
  else if (winner === "O") botScore++;

  playerScoreEl.textContent = playerScore;
  botScoreEl.textContent = botScore;

  if (playerScore === targetWins || botScore === targetWins) {
    clearInterval(timerInterval);
    statusText.textContent = playerScore === targetWins ? "🎉 You won the match!" : "🤖 Bot won the match!";
    restartBtn.style.display = "inline-block";
    nameForm.classList.remove("hidden");
  } else {
    setTimeout(resetRound, 1500);
  }
}

function resetRound() {
  for (let i = 0; i < 9; i++) board[i] = null;
  renderBoard();
}

function resetAll() {
  playerScore = 0;
  botScore = 0;
  timer = 0;
  playerScoreEl.textContent = "0";
  botScoreEl.textContent = "0";
  timerEl.textContent = "0";
  restartBtn.style.display = "none";
  nameForm.classList.add("hidden");
  document.getElementById("player-name").value = "";
  for (let i = 0; i < 9; i++) board[i] = null;
}

restartBtn.addEventListener("click", () => {
  resetAll();
  startTimer();
  renderBoard();
});

function submitName() {
  const name = document.getElementById("player-name").value;
  if (name.trim() === "") {
    alert("Please enter a name.");
    return;
  }
  alert(`Thanks, ${name}! Your time was ${timer} seconds.`);
}
let canClick = true;
function botMove() {
    let emptyIndexes = board.map((val, i) => val === null ? i : null).filter(i => i !== null);
    let move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    board[move] = "O";
    renderBoard();
    canClick = true;
  }
  document.getElementById("back-btn").addEventListener("click", () => {
    clearInterval(timerInterval);
    resetAll();
    gameContainer.classList.add("hidden");
    document.getElementById("mode-select").classList.remove("hidden");
  });
  