const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const grid = 20;                    // প্রতি ব্লকের সাইজ
const rows = canvas.height / grid;
const cols = canvas.width / grid;

let snake = [
  {x: 10, y: 10}
];
let dx = 1;   // শুরুতে ডান দিকে যাবে
let dy = 0;
let food = {};
let score = 0;
let gameOver = false;
let gameInterval;

// তোমার ছবি লোড করা (সাপের হেড)
const snakeHeadImg = new Image();
snakeHeadImg.src = "head.png";   // তোমার ছবির নাম

// খাবার তৈরি
function createFood() {
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

// গেম ড্র করা
function drawGame() {
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", 80, 200);
    return;
  }

  // ব্যাকগ্রাউন্ড
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // নতুন হেড তৈরি
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // ওয়ালে ধাক্কা খেলে গেম ওভার
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
    gameOver = true;
    return;
  }

  // নিজের সাথে ধাক্কা
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver = true;
      return;
    }
  }

  snake.unshift(head);   // নতুন হেড যোগ

  // খাবার খেয়েছে কিনা
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    createFood();
  } else {
    snake.pop();         // লেজ কাটা
  }

  // সাপের বডি আঁকা (সবুজ রঙ)
  ctx.fillStyle = "#4ade80";
  for (let i = 1; i < snake.length; i++) {
    ctx.fillRect(snake[i].x * grid, snake[i].y * grid, grid - 2, grid - 2);
  }

  // সাপের হেড — তোমার ছবি দিয়ে
  if (snakeHeadImg.complete) {
    ctx.save();
    // দিক অনুসারে ছবি ঘোরানো (optional, কিন্তু সুন্দর লাগবে)
    let angle = 0;
    if (dx === 1) angle = 0;
    else if (dx === -1) angle = Math.PI;
    else if (dy === 1) angle = Math.PI / 2;
    else if (dy === -1) angle = -Math.PI / 2;

    ctx.translate((snake[0].x + 0.5) * grid, (snake[0].y + 0.5) * grid);
    ctx.rotate(angle);
    ctx.drawImage(snakeHeadImg, -grid/2, -grid/2, grid, grid);
    ctx.restore();
  } else {
    // যদি ছবি লোড না হয় তাহলে সাধারণ হলুদ বর্গ
    ctx.fillStyle = "#facc15";
    ctx.fillRect(snake[0].x * grid, snake[0].y * grid, grid, grid);
  }

  // খাবার আঁকা (লাল বৃত্ত)
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc((food.x + 0.5) * grid, (food.y + 0.5) * grid, grid/2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

// কীবোর্ড কন্ট্রোল
document.addEventListener("keydown", e => {
  if (gameOver) return;

  switch(e.key) {
    case "ArrowUp":
      if (dy !== 1) { dx = 0; dy = -1; }
      break;
    case "ArrowDown":
      if (dy !== -1) { dx = 0; dy = 1; }
      break;
    case "ArrowLeft":
      if (dx !== 1) { dx = -1; dy = 0; }
      break;
    case "ArrowRight":
      if (dx !== -1) { dx = 1; dy = 0; }
      break;
  }
});

// গেম লুপ
function gameLoop() {
  drawGame();
}

createFood();
gameInterval = setInterval(gameLoop, 120);   // গতি (ছোট সংখ্যা = দ্রুত)

// রিস্টার্ট করার জন্য (optional)
document.addEventListener("keypress", e => {
  if (e.key === "r" && gameOver) {
    location.reload();
  }
});
