var actions = {
  standing: 0,
  walkingRight: 4,
  walkingLeft: 8,
  //   runningRight: 12,
  //   runningLeft: 16,
  jumpingStraight: 20,
  jumpingRight: 24,
  jumpingLeft: 28,
  fallingStraight: 30,
  fallingRight: 32,
  fallingLeft: 36,
  climbing: 40,
};

function getAction(data, oldX, oldY, newX, newY) {
  let action = actions.standing;

  var leftArrowDown = data.keys.down[37];
  var rightArrowDown = data.keys.down[39];
  var upArrowDown = data.keys.down[38];
  var downArrowDown = data.keys.down[40];

  // handle downwards movement
  if (newY > oldY) {
    action = actions.fallingStraight;
    if (leftArrowDown) action = actions.fallingLeft;
    if (rightArrowDown) action = actions.fallingRight;
    if (upArrowDown || downArrowDown) action = actions.climbing;
  }

  // handle upwards movement
  if (newY < oldY) {
    action = actions.jumpingStraight;
    if (leftArrowDown) action = actions.jumpingLeft;
    if (rightArrowDown) action = actions.jumpingRight;
    if (upArrowDown || downArrowDown) action = actions.climbing;
  }

  // if we aren't moving vertically, handle horizontal movement
  if (newY === oldY) {
    // handle moving right
    if (rightArrowDown) {
      action = actions.walkingRight;
    }

    // handle moving left
    if (leftArrowDown) {
      action = actions.walkingLeft;
    }
  }

  return action;
}
