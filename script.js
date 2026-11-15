nn.on('load', () => {
  kaplay({
    buttons: {
      "moveUp": {
        keyboard: ["up", "w"],
        gamepad: ["dpad-up"],
      },
      "moveDown": {
        keyboard: ["down", "s"],
        gamepad: ["dpad-down"],
      },
      "moveLeft": {
        keyboard: ["left", "a"],
        gamepad: ["dpad-left"],
      },
      "moveRight": {
        keyboard: ["right", "d"],
        gamepad: ["dpad-right"],
      },
    }
  });

  const SPEED = 120;
  const JUMP_FORCE = 500;
  const DEADZONE = 0.15;
  let beeSound;
  let isPlaying = false;
  let bgm = false;
  let bullet;
  const score = add([
    text("0", {
      size: 24
    }),
    pos(24, 24),
    {
      value: 0
    },
  ]);
  setGravity(640);


  // load visual assets

  loadSprite("player", "assets/playersprite.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
      "forward": {
        // Starts from frame 0, ends at frame 3
        from: 0,
        to: 3,
        // Frame per second
        speed: 5,
        loop: true,
      },
      "left": {
        from: 4,
        to: 7,
        speed: 10,
        loop: true,
      },
      "right": {
        from: 8,
        to: 11,
        speed: 10,
        loop: true,
      },
      "back": {
        from: 12,
        to: 15,
        speed: 10,
        loop: true,
      },

    },
  });

  loadSprite("playeridle", "assets/idleplayer.png", {

    sliceX: 4,
    sliceY: 4,
    // Define animations
    anims: {
      "idle": {

        from: 0,
        to: 15,
        // Frame per second
        speed: 5,
        loop: true,
      },
    }
  });
  loadSprite("bFly", "assets/btfly-o.png");

  // load music and sound effects
  loadSound("bee", "assets/BEES.mp3");
  loadSound("bbbean voice", "assets/bean_voice.wav")
  loadMusic("bgm", "assets/bgm.wav")
  loadSound("sparkle", "assets/sparkle.wav")

  function playBee () {
    if (!isPlaying) {
      isPlaying = true;

      beeSound = play("bee", {
        volume: 0.04,
      });

      beeSound.onEnd(() => {
        isPlaying = false;
      });
    }
  }

  // Add our player character 
  const player = add([
    sprite("playeridle"),
    pos(center()),
    anchor("center"),
    area(),
    body({
      jumpForce: JUMP_FORCE
    }),
    // Adds the double jump component
    doubleJump(),
  ]);


  player.play("idle")
  // Add a platforms

  function makePlatform (x, y, w, colorValue) {
    add([
      rect(w, 24),
      area(),
      outline(6),
      pos(x, y),
      body({
        isStatic: true
      }),
      color(colorValue),
    ]);
  }
  makePlatform(0, height() - 24, width(), MAGENTA);
  makePlatform(30, height() - 100, 150, "#CC02CC");
  makePlatform(width() - 150, height() - 150, 150, "#9C029C");
  makePlatform(width() - 300, height() - 300, 150, "#590159");
  makePlatform(width() - 500, height() - 500, 150, "#2E002E");
  makePlatform(10, height() - 600, 300, BLACK);
  //timer
  let timeLeft = 30;

  const timer = add([
    anchor("topright"),
    pos(width() - 24, 24),
    text(timeLeft.toString()),
  ]);

 //ADD projectiles out of a gun 
  
  let facing = RIGHT;
  
  //controlls + timer
  onUpdate(() => {
   const moveDir = getGamepadStick("left");

    if (moveDir.len() > DEADZONE) {
        player.move(moveDir.scale(SPEED));
    }

    //timer
    timeLeft -= dt();
    if (timeLeft <= 0) {
      go("win", score.value);
    }
    timer.text = timeLeft.toFixed(2);

  });
  
  onButtonDown("moveRight", () => {
    player.move(SPEED, 0);
    playBee();
    facing = RIGHT;
  });

  onButtonDown("moveUp", () => {
    player.doubleJump();
  });

  onButtonDown("moveDown", () => {
    player.move(0, -SPEED);
  });


  onButtonDown("moveLeft", () => {
    player.move(-SPEED, 0);
    playBee();
    facing = LEFT;
  });

 //projectile
  function shoot() {

   bullet = add([
     circle(4),
      color(BLUE),
        pos(player.pos),
        anchor("center"),
        area(),
        move(facing, 500),
        offscreen({ destroy: true }),
        "bullet",
    ]);
  }
onGamepadButtonPress ("south", shoot);

  

  //enemies 
  function spawnBFly() {

    const bFly = add([
        sprite("bFly"),
        pos(
            rand(100, width() - 100),
            rand(100, height() - 100)
        ),
        area(),
        anchor("center"),
        "bFly",
    ]);

    // random lifespan
    wait(rand(3, 30), () => {
        if (bFly.exists()) {
            destroy(bFly);
        }
    });
    

}
  
  function spawnBFlyWave() {

    const amount = randi(3, 8);

    for (let i = 0; i < amount; i++) {
        spawnBFly();
    }

}
  loop(15, () => {
    spawnBFlyWave();
});

  onCollide("bullet", "bFly", (bullet, bFly) => {

    destroy(bullet);
    destroy(bFly);

    score.value += 5;
    score.text = score.value.toString();

});

  // goodies forr score increase
  loadSprite("sparkle", "assets/sparkles.png");

  function spawnSparkle () {
    add([
      sprite("sparkle"),
      pos(rand(0, width()), rand(0, height())),
      scale(rand(0.5, 1.5)),
      rotate(rand(0, 180)),
      anchor("center"),
      area(),
      "sparkle", // collision tag
    ]);
  }

  // spawn 5
  for (let i = 0; i < 5; i++) {
    spawnSparkle();
  }
  
  // continous spawning
  loop(5, () => {
    spawnSparkle();
});


  //score
  player.onCollide("sparkle", (s) => {
    destroy(s);
    play("sparkle");
    score.value++;
    score.text = score.value.toString();
    /// add spawnSparkle(); to spawn more
  })
player.onCollide("bFly", () => {
    go("lose");
});
  
  //music 

  onLoad(() => {
    bgm = play("bgm", {
      loop: true,
      volume: 0.5,
      paused: false
    });
  })
  onKeyPress("space", () => bgm.paused = !bgm.paused);

  //camera change to more platforms and ghosts if player go to botton right corner

  //new scene add a lose scene and a scene  at a certain amount of time the scene goes inverted
  scene("win", (score) => {
    add([
      sprite("player"),
      pos(width() / 2, height() / 2 - 80),
      scale(2),
      anchor("center"),

    ]);
    
    
    if (timeLeft <= 0) {
    go("lose");
}
    scene("lose", () => {

    add([
        text("YOU LOSE", {
            size: 48,
        }),
        pos(center()),
        anchor("center"),
    ]);

    add([
        text("Press ENTER"),
        pos(center().add(0, 60)),
        anchor("center"),
    ]);

    onKeyPress("enter", () => {
        go("game");
    });

});


  })
})