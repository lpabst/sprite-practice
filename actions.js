var actions = {
  standing: 0,
  walkingRight: 4,
  walkingLeft: 8,
  runningRight: 12,
  runningLeft: 16,
  jumpingStraight: 20,
  jumpingRight: 24,
  jumpingLeft: 28,
  fallingStraight: 30,
  fallingRight: 32,
  fallingLeft: 36,
  climbing: 40,
  showButt: 44,
};

function getAction(data, oldX, oldY, newX, newY) {
  let action = actions.standing;

  const leftArrowDown = data.keys.down[37];
  const rightArrowDown = data.keys.down[39];
  const upArrowDown = data.keys.down[38];
  const downArrowDown = data.keys.down[40];
  const bDown = data.keys.down[66];
  const sDown = data.keys.down[83];

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
    // if 'b' is down, show the cat's butt
    if (bDown) {
      action = actions.showButt;
    }

    // handle moving right
    if (rightArrowDown) {
      action = actions.walkingRight;
      if (sDown) action = actions.runningRight;
    }

    // handle moving left
    if (leftArrowDown) {
      action = actions.walkingLeft;
      if (sDown) action = actions.runningLeft;
    }
  }

  return action;
}
