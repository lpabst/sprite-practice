var debugBoundaries = false;

var gravityAcceleration = 0.3;
var maxGravitySpeed = 3;

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.w = 40;
  this.h = 40;
  this.startX = x;
  this.startY = y;
  this.speed = 1.2;
  this.yVel = 0;
  this.availableJumps = 2;
  this.jumpVel = -5;
  this.type = "player";

  // action tracking will determine which sprite image shows
  this.prevAction = null;
  this.action = actions.standing;
  this.actionCount = 0;

  // update the sprite action based on movement
  this.handleUpdateAction = function (data, oldX, oldY, newX, newY) {
    const action = getAction(data, oldX, oldY, newX, newY);
    if (this.action !== action) {
      this.prevAction = this.action;
      this.action = action;
      this.actionCount = 0;
    } else {
      // every 10 frames, update the action count to show the next sprite image
      if (data.animationFrame % 10 === 0) {
        this.actionCount++;
      }
    }
  };

  // called by the game.update method
  this.update = function (data) {
    var spacebarDown = data.keys.down[32];
    var leftArrowDown = data.keys.down[37];
    var rightArrowDown = data.keys.down[39];
    var sDown = data.keys.down[83];
    var newX = this.x;
    var newY = this.y;

    // if 's' is down, we are sprinting, so increase the speed
    if (sDown) this.speed = 2.4;
    else this.speed = 1.2;

    if (leftArrowDown) {
      newX -= this.speed;
    }
    if (rightArrowDown) {
      newX += this.speed;
    }

    // gravity accelerates us up to a max speed
    if (this.yVel < maxGravitySpeed) {
      this.yVel += gravityAcceleration;
    }

    // make player jump if space bar is pressed
    if (spacebarDown && this.availableJumps > 0) {
      data.keys.down[32] = false;
      this.availableJumps--;
      this.yVel = this.jumpVel;
    }

    newY += this.yVel;

    // map edges are boundaries
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > data.canvas.w - this.w) newX = data.canvas.w - this.w;
    if (newY > data.canvas.h - this.h) newY = data.canvas.h - this.h;

    // if we aren't falling, get our jumps back
    if (this.y === newY) this.availableJumps = 2;

    // update the action so our sprite looks right
    this.handleUpdateAction(data, this.x, this.y, newX, newY);

    this.x = newX;
    this.y = newY;
  };

  // called by the game.render() method
  this.render = function (data) {
    let spriteX, spriteY;

    // based on our current action, draw a different sprite image
    if (this.action === actions.walkingLeft) {
      spriteY = 35;
      if (this.actionCount % 3 === 0) {
        spriteX = 0;
      } else if (this.actionCount % 3 === 1) {
        spriteX = 33;
      } else {
        spriteX = 66;
      }
    } else if (this.action === actions.walkingRight) {
      spriteY = 67;
      if (this.actionCount % 3 === 0) {
        spriteX = 0;
      } else if (this.actionCount % 3 === 1) {
        spriteX = 33;
      } else {
        spriteX = 66;
      }
    } else if (this.action === actions.runningLeft) {
      spriteY = 35;
      if (this.actionCount % 2 === 0) {
        spriteX = 193;
      } else {
        spriteX = 227;
      }
    } else if (this.action === actions.runningRight) {
      spriteY = 67;
      if (this.actionCount % 2 === 0) {
        spriteX = 193;
      } else {
        spriteX = 227;
      }
    } else if (this.action === actions.fallingRight) {
      spriteY = 99;
      // spriteX = 322;
      spriteX = 290;
    } else if (this.action === actions.fallingLeft) {
      spriteY = 33;
      // spriteX = 322;
      spriteX = 290;
    } else if (this.action === actions.jumpingRight) {
      spriteY = 99;
      spriteX = 290;
    } else if (this.action === actions.jumpingLeft) {
      spriteY = 33;
      spriteX = 290;
    } else if (this.action === actions.showButt) {
      spriteX = 39;
      spriteY = 98;
    } else {
      // default to sprite of standing still
      spriteX = 40;
      spriteY = 3;
      // if the cat stands still for long enough, it sits down then lays down
      if (this.actionCount >= 20 && this.actionCount < 40) {
        spriteX = 135;
        spriteY = 130;
      }
      if (this.actionCount >= 40 && this.actionCount < 42) {
        spriteX = 98;
        spriteY = 131;
      }
      if (this.actionCount >= 42 && this.actionCount < 44) {
        spriteX = 130;
        spriteY = 163;
      }
      if (this.actionCount >= 44 && this.actionCount < 60) {
        spriteX = 5;
        spriteY = 228;
      }
      if (this.actionCount >= 60) {
        spriteX = 5;
        spriteY = 164;
      }
    }

    data.canvas.drawSprite(
      this.img,
      spriteX,
      spriteY,
      this.w - 11,
      this.h - 10,
      this.x,
      this.y,
      this.w,
      this.h
    );

    if (debugBoundaries) {
      data.canvas.drawRect(this.x, this.y, this.w, this.h, "blue");
    }
  };

  // load sprite sheet
  this.loadSprite = async function () {
    return new Promise((resolve, reject) => {
      this.img = new Image();
      this.img.src = "./cat_sprite.png";
      this.img.onload = function () {
        resolve(this);
      };
      this.img.onerror = function (e) {
        reject(e);
      };
    });
  };
}
