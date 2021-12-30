var debugBoundaries = false;

var gravityAcceleration = 0.3;
var maxGravitySpeed = 3;

// check if entities are touching in any way
function isCollision(entity1, entity2) {
  window.entity1 = entity1;
  window.entity2 = entity2;
  var entity1Left = entity1.x;
  var entity1Right = entity1.x + entity1.w;
  var entity1Top = entity1.y;
  var entity1Bottom = entity1.y + entity1.h;
  var entity2Left = entity2.x;
  var entity2Right = entity2.x + entity2.w;
  var entity2Top = entity2.y;
  var entity2Bottom = entity2.y + entity2.h;

  var sameVerticalSpace =
    (entity1Left < entity2Right && entity1Right > entity2Left) ||
    (entity2Left < entity1Right && entity2Right > entity1Left);
  var sameHorizontalSpace =
    (entity1Top < entity2Bottom && entity1Bottom > entity2Top) ||
    (entity2Top < entity1Bottom && entity2Bottom > entity1Top);

  if (sameVerticalSpace && sameHorizontalSpace) return true;
  else return false;
}

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.w = 40;
  this.h = 40;
  this.startX = x;
  this.startY = y;
  this.speed = 2.2;
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
    var upArrowDown = data.keys.down[38];
    var downArrowDown = data.keys.down[40];
    var newX = this.x;
    var newY = this.y;

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
    } else if (
      this.action === actions.jumpingRight ||
      this.action === actions.fallingRight
    ) {
      spriteY = 195;
      spriteX = 165;
    } else if (
      this.action === actions.jumpingLeft ||
      this.action === actions.fallingLeft
    ) {
      spriteY = 130;
      spriteX = 165;
    } else {
      // default to sprite of standing still
      spriteX = 40;
      spriteY = 3;
      // if the cat stands still for long enough, it sits down then lays down
      if (this.actionCount >= 10 && this.actionCount < 20) {
        spriteX = 135;
        spriteY = 130;
      }
      if (this.actionCount >= 20 && this.actionCount < 30) {
        spriteX = 5;
        spriteY = 228;
      }
      if (this.actionCount >= 30) {
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
