nn.on("load", () => {


  // KAPLAY SETUP

  kaplay({
buttons: {
      moveUp: {
        keyboard: ["up", "w"],
        gamepad: ["dpad-up"],
      },
      moveDown: {
        keyboard: ["down", "s"],
        gamepad: ["dpad-down"],
      },
      moveLeft: {
        keyboard: ["left", "a"],
        gamepad: ["dpad-left"],
      },
      moveRight: {
        keyboard: ["right", "d"],
        gamepad: ["dpad-right"],
      },
    },
    background: [222,217,217],
  });


  // GLOBAL VARIABLES

  const SPEED = 120;
  const JUMP_FORCE = 500;
  const DEADZONE = 0.15;

  let beeSound;
  let isPlaying = false;
  let bgm;
  let timeLeft = 30;
  let gameScore = 0;
  let spawnSide = "left";


  // SPRITES
  loadSprite("player", "assets/playersprite.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
      forward: {
        from: 0,
        to: 3,
        speed: 5,
        loop: true,
      },
      left: {
        from: 4,
        to: 7,
        speed: 10,
        loop: true,
      },
      right: {
        from: 8,
        to: 11,
        speed: 10,
        loop: true,
      },
      back: {
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
    anims: {
      idle: {
        from: 0,
        to: 15,
        speed: 5,
        loop: true,
      },
    },
  });

  loadSprite("bFly", "assets/btfly-o.png");
  loadSprite("sparkle", "assets/sparkles.png");

  // AUDIO ASSETS
  loadSound("bee", "assets/BEES.mp3");
  loadSound("beanVoice", "assets/bean_voice.wav");
  loadSound("sparkleSound", "assets/sparkle.wav");
  loadMusic("bgm", "assets/bgm.wav");


  // HELPERS

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
      "platform"
    ]);
  }

  function spawnSparkle () {
    add([
      sprite("sparkle"),
      pos(rand(0, width()), rand(0, height())),
      scale(rand(0.5, 1.5)),
      rotate(rand(0, 180)),
      area(),
      anchor("center"),
      "sparkle",
    ]);
  }

  function spawnBFly () {
    const fly = add([
      sprite("bFly"),
      pos(
        rand(100, width() - 100),
        rand(100, height() - 100)
      ),
      area(),
      anchor("center"),
      "bFly",
    ]);

    wait(rand(3, 30), () => {
      if (fly.exists()) {
        destroy(fly);
      }
    });
  }

  function spawnBFlyWave () {
    const amount = randi(3, 8);

    for (let i = 0; i < amount; i++) {
      spawnBFly();
    }
  }


  
  
  // GAME SCENE SETUP
  
  //LVL 1

  scene("level1", () => {

    setGravity(640);

    let facing = RIGHT;


    const scoreText = add([
      text(gameScore.toString(), {
        size: 24,
      }),
      pos(24, 24),
      color (BLACK),
    ]);

    const timer = add([
      text(timeLeft.toFixed(0)),
      pos(width() - 24, 24),
      anchor("topright"),
      color(BLACK)
    ]);

    const player = add([
      sprite("playeridle"),
      pos(center()),
      anchor("center"),
      area(),
      body({
        jumpForce: JUMP_FORCE,
      }),
      doubleJump(),
    ]);

    player.play("idle");
    
    const levelExit = add([
    rect(10,height()),
    pos(width()-10,0),
    area(),
      color(GREEN),
   // opacity(0),
    "levelExit",
]);

    // PLATFORMS

    makePlatform(0, height() - 24, width(), MAGENTA);
    for (let i = 0; i < 7; i++) {

      makePlatform(

        rand(0, width() - 250),

        height() - 150 - (i * 100),

        rand(50, 300),

        rgb(rand(0, 255), 0, rand(0, 255))

      );

    }
    // SPARKLES

    for (let i = 0; i < 5; i++) {
      spawnSparkle();
    }

    loop(5, spawnSparkle);

    // BFLY SPAWNING

    spawnBFlyWave();
    loop(15, spawnBFlyWave);

    // CONTROLS

    onButtonDown("moveRight", () => {
      player.move(SPEED, 0);
      facing = RIGHT;
      playBee();
    });

    onButtonDown("moveLeft", () => {
      player.move(-SPEED, 0);
      facing = LEFT;
      playBee();
    });

    onButtonDown("moveUp", () => {
      player.doubleJump();
    });

    onButtonDown("moveDown", () => {
      player.move(0, -SPEED);
    });

    // PROJECTILES

    function shoot () {
      add([
        circle(4),
        color(BLUE),
        pos(player.pos),
        anchor("center"),
        area(),
        move(facing, 500),
        offscreen({
          destroy: true
        }),
        "bullet",
      ]);
    }

    onGamepadButtonPress("south", shoot);
    onKeyPress("f", shoot);

    // TIMER & ANALOG MOVEMENT
    onUpdate(() => {

      const moveDir = getGamepadStick("left");

      if (moveDir.len() > DEADZONE) {
        player.move(moveDir.scale(SPEED));
      }

      timeLeft -= dt();

      timer.text = timeLeft.toFixed(1);

      if (timeLeft <= 0) {
        go("win");
      }
    });

    // COLLISION

    player.onCollide("sparkle", (s) => {

      destroy(s);

      play("sparkleSound");

      gameScore++;
      scoreText.text = gameScore.toString();
    });

    player.onCollide("bFly", () => {
      go("lose");
    });

    onCollide("bullet", "bFly", (bullet, fly) => {

      destroy(bullet);
      destroy(fly);

      gameScore += 5;
      scoreText.text = gameScore.toString();
    });
    
    const fade = add([
    rect(width(), height()),
    pos(0, 0),
    color(BLACK),
    opacity(0),
    fixed(),
]);
      player.onCollide("levelExit", () => {

    tween(
        0,
        1,
        0.5,
        (value) => {
            fade.opacity = value;
        },
        easings.linear
    );

    wait(0.5, () => {

        spawnSide = "left";

        go("level2");

    });

});
  });
  

  
  // LVL 2
  scene("level2", () => {
console.log("LEVEL2");
    setGravity(640);

    let facing = RIGHT;
  
    const scoreText = add([
    text(gameScore.toString(), {
        size: 24,
    }),
    pos(24, 24),
      color(BLACK)
]);

const timer = add([
    text(timeLeft.toFixed(1)),
    pos(width() - 24, 24),
    anchor("topright"),
  color(BLACK)
]);

  

    const player = add([
        sprite("playeridle"),
        pos(spawnSide === "left" ? 150
          : width() - 150,
            height() / 2
        ),
        anchor("center"),
        area(),
        body({
            jumpForce: JUMP_FORCE,
        }),
        doubleJump(),
    ]);

    player.play("idle");
    
const returnExit = add([
    rect(10, height()),
    pos(0,0),
    area(),
      color(MAGENTA),
   // opacity(0),
    "returnExit",
]);
    // Ground
    makePlatform(
        0,
        height() - 24,
        width(),
       GREEN
    );

    // Random platforms
    for (let i = 0; i < 12; i++) {

        makePlatform(
            rand(0, width() - 300),
            rand(100, height() - 100),
            rand(100, 350),
            rgb(0, rand(100, 255), rand(100, 255))
        );

    }

    // Spawn Butterflies
    spawnBFlyWave();

    loop(20, () => {
        spawnBFlyWave();
    });

    // controlls
    onButtonDown("moveRight", () => {
        player.move(SPEED, 0);
        facing = RIGHT;
        playBee();
    });

    onButtonDown("moveLeft", () => {
        player.move(-SPEED, 0);
        facing = LEFT;
        playBee();
    });

    onButtonDown("moveUp", () => {
        player.doubleJump();
    });

    function shoot() {
        add([
            circle(4),
            color(YELLOW),
            pos(player.pos),
            area(),
            move(facing, 500),
            offscreen({ destroy: true }),
            "bullet",
        ]);
    }

    onGamepadButtonPress("south", shoot);
    onKeyPress("f", shoot);
    //collision
    onCollide("bullet", "bFly", (bullet, fly) => {

    destroy(bullet);
    destroy(fly);

    gameScore += 5;

    scoreText.text = gameScore.toString();

});
    player.onCollide("bFly", () => {
    go("lose");
});
    //sparkle
    for (let i = 0; i < 5; i++) {
    spawnSparkle();
}

loop(5, spawnSparkle);
    
    player.onCollide("sparkle", (s) => {

    destroy(s);

    play("sparkleSound");

    gameScore++;

    scoreText.text = gameScore.toString();

});
    //camera
     camScale(1.5);
    player.onUpdate(() => {
      camPos(player.pos);
     
    })
    
    //timer + analogue movement
 onUpdate(() => {

    const moveDir = getGamepadStick("left");

    if (moveDir.len() > DEADZONE) {
        player.move(moveDir.scale(SPEED));
    }

    timeLeft -= dt();

    timer.text = timeLeft.toFixed(1);

    scoreText.text = gameScore.toString();

    if (timeLeft <= 0) {
        go("lose");
    }

    if (gameScore >= 50) {
        go("win");
    }

});
    player.onCollide("returnExit", () => {

    spawnSide = "right";

    go("level1");

});

});

  // WIN SCENE
  scene("win", (finalScore) => {

    add([
      text(`YOU WIN!\nScore: ${gameScore}`, {
        size: 32,
      }),
      pos(center()),
      anchor("center"),
      color(BLACK),
    ]);

    add([
      text("Press ENTER to play again"),
      pos(center().add(0, 120)),
      anchor("center"),
      color(BLACK),
    ]);
    

    onKeyPress("enter", () => {
      gameScore = 0;
      timeLeft=30;
      go("level1");
    });
  });


  // LOSE SCENE
  scene("lose", () => {

    add([
      text("YOU LOSE", {
        size: 48,
      }), color(BLACK),
      pos(center()),
      anchor("center"),
    ]);

    add([
      text("Press ENTER to try again"),
      pos(center().add(0, 80)),
      anchor("center"),
      color(BLACK),
    ]);

    onKeyPress("enter", () => {
      gameScore = 0;
      timeLeft=30;
      go("level1");
    });
  });


  // START MUSIC AFTER LOAD
  onLoad(() => {
    bgm = play("bgm", {
      loop: true,
      volume: 0.5,
    });
  });

  onKeyPress("space", () => {
    bgm.paused = !bgm.paused;
  });

  // START GAME
  go("level1");
});