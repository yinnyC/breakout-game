// -------------------------
// Ball
// -------------------------

class Ball extends Sprite {
  constructor(x = 0, y = 0, dx = 2, dy = -1, radius = 10, color = 'red') {
    super(x, y, radius*2, radius*2, color);
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
  }

  // Move the location of the ball and ake sure the ball doesn't go out of the screen
  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  // Draw a ball shape
  render(ctx) { // Overiding the render method
    ctx.beginPath();  
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
