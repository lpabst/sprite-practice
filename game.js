const game = {
  /*********** INITIALIZATION ******************/

  init: function (editorData = null) {
    console.log("game.init()");
    // hide buttons, inputs, etc
    document.getElementById("controls").classList.add("hidden");

    // create data object to be passed around
    const data = {
      startTime: Date.now(),
      canvas: null,
      gameOver: false,
      gameRunning: true,
      animationFrame: 0,
      player: null,
      enemies: [],
      walls: [],
      eventListeners: [],
      keys: { down: {} },
      gameLevel: 1,
      levelStartTime: null,
      points: 0,
      lives: 5,
    };

    game.initCanvas(data);
    game.initEventListeners(data);
    game.initLevel(data, editorData);

    game.run(data);
  },

  initCanvas: function (data) {
    console.log("game.initCanvas()");
    const canvas = new Canvas("canvas");
    canvas.clear();
    data.canvas = canvas;
  },

  initEventListeners: function (data) {
    console.log("game.initEventListeners()");
    // helper function creates the event listener and adds it to the data.eventListeners array so we can unbind it later
    function createEventListener(target, eventType, handler) {
      target.addEventListener(eventType, handler);
      data.eventListeners.push({
        target: target,
        eventType: eventType,
        handler: handler,
      });
    }

    createEventListener(window, "keydown", (e) => game.handleKeydown(e, data));
    createEventListener(window, "keyup", (e) => game.handleKeyup(e, data));
  },

  initLevel: function (data, editorData, retry = false) {
    console.log("game.initLevel()");
    var level = levelData[data.gameLevel];

    // if we complete all of the levels, start back at level 1
    if (!level) {
      // if retry is true, then we tried to start back at level one, but something still went wrong
      if (retry) {
        console.error("Something went wrong, please try again later: ");
        game.gameOver(data);
        return;
      }

      // otherwise, set game level back to 1 and try to init the level again
      data.gameLevel = 1;
      return game.initLevel(data, editorData, true);
    }

    // build the entities for this level
    this.initEntitiesForLevel(data, editorData);
    data.levelStartTime = Date.now();
  },

  initEntitiesForLevel: async function (data, editorData) {
    console.log("game.initEntitiesForLevel()");
    // if an editorData object was sent in, use that data instead of building out the data from levelData
    if (editorData) {
      for (var key in editorData) {
        data[key] = editorData[key];
      }
      return;
    }

    var level = levelData[data.gameLevel];

    // see if we're missing data in our level setup info
    if (!level.player || !level.walls) {
      console.error("Invalid level data: ", level);
    }

    // reset all entity info fresh
    data.player = null;
    data.walls = [];

    // build entities from level setup info
    data.player = new Player(level.player.x, level.player.y);
    await data.player.loadSprite();
    level.walls.forEach((wall) => {
      data.walls.push(new Wall(wall.x, wall.y, wall.w, wall.h));
    });
  },

  /***************** END INITIALIZATION ******************/

  /***************** EVENT HANDLERS ******************/

  handleKeydown: function (e, data) {
    const keysInUse = [27, 32, 37, 40, 66, 83];
    // get key code and prevent default action for that key
    const key = e.which || e.keyCode || 0;
    keysInUse.forEach((k) => {
      if (key === k) {
        e.preventDefault();
      }
    });

    // esc key pauses game
    if (key === 27) {
      game.pauseGame(data);
    }

    // keep track of which keys are down
    data.keys.down[key] = true;
  },

  handleKeyup: function (e, data) {
    const key = e.which || e.keyCode || 0;
    data.keys.down[key] = false;
  },

  /***************** END EVENT HANDLERS ******************/

  /***************** GAME LOOP ******************/

  run: function (data) {
    console.log("game.run()");
    function loop() {
      if (data.gameOver) {
        game.gameOver(data);
      } else {
        if (data.gameRunning) {
          game.update(data);
          game.render(data);
          data.animationFrame++;
        }

        setTimeout(() => {
          window.requestAnimationFrame(loop);
        }, 1);
      }
    }

    loop();
  },

  update: function (data) {
    // if player is out of lives, it's game over
    if (data.lives <= 0) {
      game.gameOver(data);
    }

    // tell entities that move to move themselves
    data.player.update(data);
  },

  render: function (data) {
    data.canvas.clear();
    data.canvas.drawText(390, 770, "Level: " + data.gameLevel, "white", 18);
    data.canvas.drawText(510, 770, "Lives: " + data.lives, "white", 18);
    data.canvas.drawText(630, 770, "Points: " + data.points, "white", 18);
    data.player.render(data);
    data.walls.forEach((wall) => wall.render(data));
  },

  /***************** END GAME LOOP ******************/

  /***************** OTHER METHODS ******************/

  pauseGame: function (data) {
    if (data.gameRunning) {
      // stop player movement
      data.keys.down = {};
      data.gameRunning = false;
      data.canvas.drawText(270, 350, "GAME PAUSED", "white", 40);
    } else {
      data.gameRunning = true;
    }
  },

  gameOver: function (data) {
    // prevents this from being called twice in a row
    if (data.gameOver) return;

    data.gameOver = true;
    data.gameRunning = false;
    game.removeEventListeners(data);
  },

  // unbinds all of the event listeners saved in the data.eventListeners list
  removeEventListeners: function (data) {
    data.eventListeners.forEach(function (eventListener) {
      eventListener.target.removeEventListener(
        eventListener.eventType,
        eventListener.handler
      );
    });
    data.eventListeners = [];
  },
};
