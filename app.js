// DOM Elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScoreDisplay");
const pauseScoreDisplay = document.getElementById("pauseScore");
const landingPage = document.querySelector(".landing-page");
const gameContainer = document.querySelector(".game-container");
const highScoreCard = document.getElementById("highScoreCard");
const pauseCard = document.getElementById("pauseCard");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const pauseButton = document.getElementById("pauseButton");
const exitButton = document.getElementById("exitButton");
const mobileControls = document.querySelector(".mobile-controls");
const snakeColorSelect = document.getElementById("snakeColor");
const foodColorSelect = document.getElementById("foodColor");
const playButton = document.getElementById("playButton");
const highScoreButton = document.getElementById("highScoreButton");
const closeHighScoreButton = document.getElementById("closeHighScore");
const playAgainButton = document.getElementById("playAgainButton");
const resumeButton = document.getElementById("resumeButton");

// Game variables
const gridSize = 20;
let tileCount;
let snake = [{ x: 15, y: 15 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameInterval;
let isPaused = false;
let gameSpeed = 100;
let snakeColor = "#e94560";
let foodColor = "#ff6b6b";

// Audio elements
const eatSound = document.getElementById("eatSound");
const hitWallSound = document.getElementById("hitWallSound");

// Game functions
function playEatSound() {
  eatSound.currentTime = 0;
  eatSound.play();
}

function playHitWallSound() {
  hitWallSound.currentTime = 0;
  hitWallSound.play();
}

function startGame() {
  landingPage.style.display = "none";
  gameContainer.style.display = "block";
  if (isMobile()) {
    mobileControls.style.display = "flex";
  }
  resetGame();
  gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
  if (!isPaused) {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
  }
}

function clearCanvas() {
  ctx.fillStyle = "#2a2a4e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    playEatSound();
    generateFood();
    increaseSpeed();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? snakeColor : shadeColor(snakeColor, -20);
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );

    if (index === 0) {
      ctx.fillStyle = "white";
      ctx.fillRect(segment.x * gridSize + 3, segment.y * gridSize + 3, 4, 4);
      ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 3, 4, 4);
    }
  });
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    playHitWallSound();
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      playHitWallSound();
      gameOver();
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
  finalScoreElement.textContent = score;
  gameOverScreen.style.display = "block";
}

function resetGame() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  tileCount = Math.floor(canvas.width / gridSize);
  snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
  dx = 0;
  dy = 0;
  score = 0;
  gameSpeed = 100;
  generateFood();
  updateScore();
  gameOverScreen.style.display = "none";
}

function updateScore() {
  scoreElement.textContent = score;
}

function togglePause() {
  isPaused = !isPaused;
  if (isPaused) {
    pauseButton.innerHTML = '<i class="fas fa-play"></i>';
    pauseScoreDisplay.textContent = score;
    pauseCard.style.display = "block";
  } else {
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    pauseCard.style.display = "none";
  }
}

function exitGame() {
  clearInterval(gameInterval);
  gameContainer.style.display = "none";
  landingPage.style.display = "flex";
  mobileControls.style.display = "none";
  resetGame();
}

function increaseSpeed() {
  if (gameSpeed > 50) {
    gameSpeed -= 2;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
  }
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  let RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  let GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  let BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

// Event Listeners
document.addEventListener("keydown", (e) => {
  if (isPaused) return;
  switch (e.key) {
    case "ArrowUp":
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case "ArrowDown":
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case "ArrowLeft":
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

playButton.addEventListener("click", startGame);
highScoreButton.addEventListener("click", () => {
  highScoreDisplay.textContent = highScore;
  highScoreCard.style.display = "block";
});
closeHighScoreButton.addEventListener("click", () => {
  highScoreCard.style.display = "none";
});
playAgainButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
resumeButton.addEventListener("click", togglePause);
exitButton.addEventListener("click", exitGame);
window.addEventListener("resize", resetGame);

// Mobile controls
document.getElementById("upButton").addEventListener("click", () => {
  if (dy === 0) {
    dx = 0;
    dy = -1;
  }
});
document.getElementById("downButton").addEventListener("click", () => {
  if (dy === 0) {
    dx = 0;
    dy = 1;
  }
});
document.getElementById("leftButton").addEventListener("click", () => {
  if (dx === 0) {
    dx = -1;
    dy = 0;
  }
});
document.getElementById("rightButton").addEventListener("click", () => {
  if (dx === 0) {
    dx = 1;
    dy = 0;
  }
});

// Touch controls
let xDown = null;
let yDown = null;

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      // Left swipe
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
    } else {
      // Right swipe
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
    }
  } else {
    if (yDiff > 0) {
      // Up swipe
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
    } else {
      // Down swipe
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
    }
  }

  xDown = null;
  yDown = null;
}

// Color customization
snakeColorSelect.addEventListener("change", (e) => {
  snakeColor = e.target.value;
});

foodColorSelect.addEventListener("change", (e) => {
  foodColor = e.target.value;
});

// Initialize the game
resetGame();
generateFood();
