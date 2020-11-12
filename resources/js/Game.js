/* eslint-disable max-len */
// ********************************************************
// Game
// ********************************************************
class Game {
  constructor(canvasId) {
    // DOM Reference
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d'); // To store the 2D rendering context

    // setup the values
    this.ballRadius = 10;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.brickRowCount = 3;
    this.brickColumnCount = 10;
    this.brickWidth = 35;
    this.brickHeight = 20;
    this.brickPadding = 7;
    this.brickOffsetTop = 30; // so the brick won't start right from the edge of the Canvas.
    this.brickOffsetLeft = 30;
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
    this.paddleY = this.canvas.height - this.paddleHeight - 5;
    this.objectColor = '#0095DD';

    // Create the objects
    this.ball = new Ball(0, 0, 2, -2, this.ballRadius, this.objectColor);
    this.paddle = new Paddle(this.paddleX, this.paddleY, this.paddleWidth, this.paddleHeight, this.objectColor);
    this.bricks = new Bricks({
      cols: this.brickColumnCount,
      rows: this.brickRowCount,
      width: this.brickWidth,
      height: this.brickHeight,
      padding: this.brickPadding,
      offsetTop: this.brickOffsetTop,
      offsetLeft: this.brickOffsetLeft,
      color: this.objectColor,
    });
    this.scoreLabel = new GameLabel('Score', 8, 20, this.objectColor);
    this.livesLabel = new GameLabel('Lives', this.canvas.width - 65, 20, this.objectColor);
    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();
    this.draw();
  }

  // Initialize the game
  setup() {
    this.livesLabel.value = 3;
    this.restBallAndPaddle();

    // Register Events. Listen to the behavior on keyboard and mouse
    document.addEventListener('keydown', (e) => {
      this.keyDownHandler(e);
    });
    document.addEventListener('keyup', (e) => {
      this.keyUpHandler(e);
    });
    document.addEventListener('mousemove', (e) => {
      this.mouseMoveHandler(e);
    });
    document.addEventListener('click', function(e){
      const msgBox = document.getElementsByClassName('msg-box')
      msgBox[0].style.visibility = 'hidden';
      msgBox[1].style.visibility = 'hidden';
      document.location.reload();
    })
  }

  // Reset the values
  restBallAndPaddle() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.ball.dx = 2;
    this.ball.dy = -2;
    this.paddle.x = this.paddleX;
  }

  // Check if the ball hits the brick
  collisionDetection() {
    for (let c = 0; c < this.bricks.cols; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        if (brick.status === 1) {
          if (this.ball.x > brick.x && this.ball.x < brick.x + brick.width && this.ball.y > brick.y && this.ball.y < brick.y + brick.height) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreLabel.value += 1;
            if (this.scoreLabel.value === (this.bricks.rows * this.bricks.cols)) {
              // alert('YOU WIN, CONGRATS!');
              document.getElementById('won').style.visibility = 'visible'
            }
          }
        }
      }
    }
  }

  // Move Paddle
  movePaddle() {
    // Move the paddle with keys
    if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  collisionsWithCanvasAndPaddle() {
    if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.dy = -this.ball.dy;
      } else {
        this.livesLabel.value -= 1;
        if (this.livesLabel.value < 1) {
          document.getElementById('gameover').style.visibility = 'visible'
          this.restBallAndPaddle();
        } else {
          this.restBallAndPaddle();
        }
      }
    }
  }

  // ********************************************************
  // Event Listeners
  // ********************************************************
  // Handle the key status Whenever a key is pressed
  keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  // Handle the key status Whenever a key stop being pressed
  keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  // Handle the Mouse movement
  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.x =relativeX - this.paddle.width / 2;
    }
  }

  draw() {
    // Clear the rectangle from last frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.drawBackground(ctx);
    this.ball.render(this.ctx);
    this.ball.move();
    this.movePaddle();
    this.bricks.render(this.ctx);
    this.paddle.render(this.ctx);
    this.scoreLabel.render(this.ctx);
    this.livesLabel.render(this.ctx);
    this.collisionDetection();
    this.collisionsWithCanvasAndPaddle();

    // Draw the screen again
    requestAnimationFrame(() => {
      this.draw();
    });
  }
} // End Game Class.
