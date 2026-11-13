nn.on('load', () =>{
        kaplay({
          buttons: {
        "moveUp": {
            keyboard: ["up", "w"],
            gamepad: ["north"],
        },
        "moveDown": {
            keyboard: ["down", "s"],
            gamepad: ["south"],
        },
        "moveLeft": {
            keyboard: ["left", "a"],
            gamepad: ["west"],
        },
        "moveRight": {
            keyboard: ["right", "d"],
            gamepad: ["dpad-right"],
        },
        "mutate": {
            keyboard: ["space", "t", "enter"],
            gamepad: ["south"],
            // Setting mouse binding
            mouse: "left",
        }
          }
        })
        
  const SPEED = 120;
const JUMP_FORCE = 240;
setGravity(640);

  
  

loadSprite("player", "assets/playersprite.png", {
    // The image contains 9 frames layered out horizontally, slice it into individual frames
    sliceX: 4,
  sliceY: 4,
    // Define animations
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

// Add our player character 
const player = add([
    sprite("playeridle"),
    pos(center()),
    anchor("center"),
    area(),
    body(),
]);

  player.play("idle")
// Add a platforms
  
add([
    rect(width(), 24),
    area(),
    outline(6),
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
  
  //controlls
 onUpdate(() => {
    const leftStick = getGamepadStick("left");
    const rightStick = getGamepadStick("right");

    // Move player using the configured left stick axes
    player.move(leftStick.scale(100)); 
});
  //projectiles
  
  //enemies
  
  //timer + score
  
  //music 
  
  //camera change 
  
  //new scene

  
        })
