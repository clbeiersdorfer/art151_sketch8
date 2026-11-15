nn.on('load', () =>{
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
     const score = add([
        text("0", { size: 24 }),
        pos(24, 24),
        { value: 0 },
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

  // load music and sound effects
  loadSound("bee","assets/BEES.mp3" );
  loadSound("bbbean voice","assets/bean_voice.wav" )
  loadMusic("bgm","assets/bgm.wav")
  loadSound("sparkle", "assets/sparkle.wav")
  
// Add our player character 
const player = add([
    sprite("playeridle"),
    pos(center()),
    anchor("center"),
    area(),
    body({ jumpForce: JUMP_FORCE }),
        // Adds the double jump component
        doubleJump(), 
]);


  player.play("idle")
// Add a platforms
  
add([
    rect(width(), 24),
    area(),
    outline(3, GREEN),
    pos(0, height() - 24),
    body({ isStatic: true }),
  color(MAGENTA)
]);
  add([
    rect(150, 24),
    area(),
    outline(6),
    pos(30, height() - 100),
    body({ isStatic: true }),
  color("#CC02CC")
]);
  
  add([
    rect(150, 24),
    area(),
    outline(6),
    pos(width() - 150, height() -150),
    body({ isStatic: true }),
  color("#9C029C")
]);
  
  add([
    rect(150, 24),
    area(),
    outline(6),
    pos(width() - 300, height() - 300),
    body({ isStatic: true }),
  color("#590159")
]);
    
  add([
    rect(150, 24),
    area(),
    outline(6),
    pos(width() - 500, height() - 500),
    body({ isStatic: true }),
  color("2E002E")
]);
  
   add([
    rect(300, 24),
    area(),
    outline(6),
    pos(10, height() - 600),
    body({ isStatic: true }),
  color(BLACK)
]);
  
   //timer
    let timeLeft = 30;

    const timer = add([
        anchor("topright"),
        pos(width() - 24, 24),
        text(timeLeft.toString()),
    ]);
       
  
  //controlls + timer
 onUpdate(() => {
    // Start with digital input from WASD, Arrow keys, or D-pad
    const moveDir = vec2(0, 0);
    
    //. Read both analog sticks ("left" and "right")
    const leftStick = getGamepadStick("left");
    const rightStick = getGamepadStick("right");

    // Apply deadzone and override/add stick movement if tilted
    if (leftStick.len() > DEADZONE) {
        moveDir.x = leftStick.x;
        moveDir.y = leftStick.y;
    } else if (rightStick.len() > DEADZONE) {
        moveDir.x = rightStick.x;
        moveDir.y = rightStick.y;
    }

    //  Move the player
    player.move(moveDir.scale(SPEED));
   
   //timer
   timeLeft -= dt();
        if (timeLeft <= 0) {
            go("win", score.value);
        }
        timer.text = timeLeft.toFixed(2);
   
 });
onButtonDown("moveRight", () => {
    player.move(SPEED, 0);
  if (!isPlaying) {
        isPlaying = true;
        beeSound = play("bee", {
            volume: 0.04,
        });

        // reset
        beeSound.onEnd(() => {
            isPlaying = false;
        });
    }
});

onButtonDown("moveUp", () => {
   player.doubleJump();
});

onButtonDown("moveDown", () => {
    player.move(0, -SPEED);
});
   
  
  onButtonDown("moveLeft", () => {
    player.move(-SPEED, 0);
    // player.play("left");

    if (!isPlaying) {
        isPlaying = true;
        beeSound = play("bee", {
            volume: 0.04,
        });

        // reset
        beeSound.onEnd(() => {
            isPlaying = false;
        });
    }
});

  //ADD projectiles out of a gun 
  
  //enemies (add loadprite for ghosts) that disappear (destroy()) after being shot a random about of time per a ghost (random amount of ghosts pers a reload)
  
// goodies forr score increase
 loadSprite("sparkle", "assets/sparkles.png");

function spawnSparkle() {
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

// spawn 10
for (let i = 0; i < 10; i++) {
    spawnSparkle();
}

  
  //score
player.onCollide("sparkle", (s) => {
    destroy(s);
      play("sparkle");
      score.value += 1;
    score.text = score.value.toString();
  })
 
 add([
      text(score),
      pos(width() / 2, height() / 2 + 80),
     scale(2),
     anchor("center"),
 ]);
  
  //music 
  
  onLoad(() => {
 bgm = play("bgm", {
     loop: true,
     volume: 0.5,
  paused:false
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

  
        })
})