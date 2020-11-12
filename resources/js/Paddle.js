// -------------------------
// Paddle
// -------------------------

class Paddle extends Sprite {
  constructor(x, y, width, height, color = 'red') {
    super(x, y, width, height, color);
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}
