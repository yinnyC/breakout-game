const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d'); // To store the 2D rendering context

// Set up ball's value
let x = canvas.width / 2;
let y = canvas.height - 30;
const ballRadius = 10;
let dx = 2; // x Velocity
let dy = -2; // y Velocity

// Set up paddle's value
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Set up the boolean letiables for key status
let rightPressed = false;
let leftPressed = false;

// Set up Brick's value
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30; // so the brick won't start right from the edge of the Canvas.
const brickOffsetLeft = 30;

// Initialize the bricks with 0
const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Loop through the bricks 2d array and draw the bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Keep looping through the bricks array and check if any of the brick
// collides with the ball
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
        dy = -dy;
        b.status = 0;
      }
    }
  }
}

// Handle the key status Whenever a key is pressed
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}
// Handle the key status Whenever a key stop being pressed
function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Draw a ball shape
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}
// Draw a paddle shape
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function draw() {
// Clear the rectangle from last frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw the objects
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();

  // Make sure the ball doesn't go out of the screen
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    alert('GAME OVER');
    document.location.reload();
    clearInterval(interval); // Needed for Chrome to end game
  }
  // Move the paddle with keys
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  // Keeps moving the ball
  x += dx;
  y += dy;
}
// Listen to the behavior on keyboard
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
// Keep calling draw() every 10ms
let interval = setInterval(draw, 10);
