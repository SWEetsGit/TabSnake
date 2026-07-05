let ogTitle = document.title


let gameStarting = false;


const MAX_FPS = 3;
const FRAME_INTERVAL_MS = 1000 / MAX_FPS;
let previousTimeMs = 0;


let gamePlaying = false;
let codeInputs = []
const KOMANI = ["UP", "UP", "DOWN", "DOWN", "LEFT", "RIGHT", "LEFT", "RIGHT", "B", "A"]
let gameType = "None";
const GAME_KEYS = [
   "ArrowUp",
   "ArrowDown",
   "ArrowLeft",
   "ArrowRight",
   "a",
   "b",
   "Equal"
];
let pendingDirection = "RIGHT";
let direction = "RIGHT"
const X_BOUND = 30
let snake = [{x: 1, y: 2}]
let apple = {x: X_BOUND / 2, y: 2}
let lastSnakeTailPos = {x: -1, y: -1}
let lastApplePos = {x: -1, y: -1}
let grid = []
let chars = []
let growNextTick = false;
let isHardMode = false;
let isHungerMode = false;
let lastAppleEatenTime = Date.now();
const HUNGER_TIME_MS = 10000;


const SECRET_GAME = ["DOWN", "UP", "LEFT", "RIGHT", "A", "B"]
let secretScore = 0;
let playerPos = 2;
let playerBraille = String.fromCharCode(0x2810)
let downHeld = false;
let upHeld = false;
let spaceUntilNextBarrier = 0;
const MAX_SPACE = 5;
let barriers = [];
let gameSpeed = 0;
const GAME_SPEED_INCREMENT = 0.05;
const LOOP_WAIT = 50;
let numLoopWait = LOOP_WAIT;


async function startGame() {
   if (gameStarting) return;
   gameStarting = true;


   ogTitle = document.title;
   codeInputs = [];


   if (gameType === "Snake") {
       await delayText("S", 250);
       await delayText("SN", 250);
       await delayText("SNA", 250);
       await delayText("SNAK", 250);
       await delayText("SNAKE", 250);
       await delayText("SNAKE by SWEet on YT", 750);
   } else if (gameType === "Secret") {
       await delayText("SECRET GAME", 1250);
   }


   try {
       await init();
   } finally {
       gameStarting = false;
   }
}


async function init() {
   if (gameType === "Snake") {
       previousTimeMs = 0;
       gamePlaying = true;
       codeInputs = []
       pendingDirection = "RIGHT";
       direction = "RIGHT"
       snake = [{x: 1, y: 2}]
       apple = {x: X_BOUND / 2, y: 2}
       lastSnakeTailPos = {x: -1, y: -1}
       lastApplePos = {x: -1, y: -1}
       grid = []
       chars = []
       isHardMode = false;
       isHungerMode = false;


       for (let i = 0; i < X_BOUND * 4; i++) {
           if(i / 4 == snake[0].x && i % 4 == snake[0].y
               || i / 4 == apple.x && i % 4 == apple.y)
               grid.push(true)
           else
               grid.push(false)
       }


       for (let i = 0; i < X_BOUND / 2; i++) {
            chars.push("⠀")
       }
       chars.push("|")
   } else if (gameType === "Secret") {
       previousTimeMs = 0;
       gamePlaying = true;
       grid = []
       chars = []
       secretScore = 0;
       barriers = [];
       playerPos = 2;
       upHeld = false;
       downHeld = false;
       spaceUntilNextBarrier = 0;
       gameSpeed = 0;
       numLoopWait = LOOP_WAIT;


       for (let i = 0; i < X_BOUND * 4; i++) {
           if(i / 4 == 0 && i % 4 == playerPos)
               grid.push(true)
           else
               grid.push(false)
       }


       for (let i = 0; i < X_BOUND / 2; i++) {
            chars.push("⠀")
       }
   }


   await update();
}


function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}


async function delayText(text, delay) {
   document.title = text;
   await sleep(delay);
}


document.addEventListener("keydown", (e) => {
   if (GAME_KEYS.includes(e.key)) {
       // e.preventDefault();
   }


   switch (e.key) {
       case "ArrowLeft":
           pendingDirection = "LEFT";
           codeInputs.push(pendingDirection);
           break;
       case "ArrowRight":
           pendingDirection = "RIGHT";
           codeInputs.push(pendingDirection);
           break;
       case "ArrowUp":
           pendingDirection = "UP";
           upHeld = true;
           codeInputs.push(pendingDirection);
           break;
       case "ArrowDown":
           pendingDirection = "DOWN";
           downHeld = true;
           codeInputs.push(pendingDirection);
           break;
       case "a":
           codeInputs.push("A");
           break;
       case "b":
           codeInputs.push("B");
           break;
       case "h":
           codeInputs.push("H");
           break;
       case "=":
           codeInputs.push("Equal")
   }


   if (codeInputs.length > 20) {
       codeInputs.shift();
   }


   if (!gamePlaying && codeInputs.length >= KOMANI.length) {
       let isSnake = true;


       for (let i = 0; i < KOMANI.length; i++) {
           if (codeInputs[codeInputs.length - KOMANI.length + i] != KOMANI[i]) {
               isSnake = false;
               break;
           }
       }


       if (isSnake) {
           gameType = "Snake"
           startGame();
       }
   }


   if (!gamePlaying && codeInputs.length >= SECRET_GAME.length) {
       let isSecret = true;


       for (let i = 0; i < SECRET_GAME.length; i++) {
           if (codeInputs[codeInputs.length - SECRET_GAME.length + i] != SECRET_GAME[i]) {
               isSecret = false;
               break;
           }
       }


       if (isSecret) {
        gameType = "Secret"
        startGame();
       }
   }


   if(gamePlaying && !isHardMode) {
       let playerSetHardMode = true;
       for (let i = 0; i < 3; i++) {
           if (codeInputs[codeInputs.length - i - 1] !== "Equal")
               playerSetHardMode = false;
       }
       isHardMode = playerSetHardMode;
   }


   if(gamePlaying && !isHungerMode) {
       let playerSetHungerMode = true;
       for (let i = 0; i < 3; i++) {
           if (codeInputs[codeInputs.length - i - 1] !== "H")
               playerSetHungerMode = false;
       }
       lastAppleEatenTime = Date.now();
       isHungerMode = playerSetHungerMode;
   }
});


document.addEventListener("keyup", (e) => {
   if (gameType === "Secret") {
       if (e.key === "ArrowUp") {
           upHeld = false;
       }


       if (e.key === "ArrowDown") {
           downHeld = false;
       }
   }
});


function setDirection() {
 if (pendingDirection == "LEFT" && direction != "RIGHT") {
   direction = "LEFT";
 } else if (pendingDirection == "RIGHT" && direction != "LEFT") {
   direction = "RIGHT";
 } else if (pendingDirection == "DOWN" && direction != "UP") {
   direction = "DOWN";
 } else if (pendingDirection == "UP" && direction != "DOWN") {
   direction = "UP";
 }
}


function calculateNewPos() {
 switch(direction) {
   case "LEFT":
       snake[snake.length - 1].x--;
       break;
   case "RIGHT":
       snake[snake.length - 1].x++;
       break;
   case "DOWN":
       snake[snake.length - 1].y++;
       break;
   case "UP":
       snake[snake.length - 1].y--;
       break;
 }
}


function setSnakePos() {
   if (growNextTick) {
       snake.unshift({
           x: lastSnakeTailPos.x,
           y: lastSnakeTailPos.y
       });


       growNextTick = false;
   }


   lastSnakeTailPos.x = snake[0].x
   lastSnakeTailPos.y = snake[0].y


   for (let i = 0; i < snake.length; i++) {
       if (i == snake.length - 1) {
           calculateNewPos();
       } else {
           snake[i].x = snake[i + 1].x;
           snake[i].y = snake[i + 1].y;
       }
   }
}


function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getNewApplePos() {
   lastApplePos.x = apple.x
   lastApplePos.y = apple.y


   let appleX = 0;
   let appleY = 0;
   let validPos = false;


   while (!validPos) {
       appleX = getRandomInt(1, X_BOUND);
       appleY = getRandomInt(1, 4);


       validPos = true;


       for (const segment of snake) {
           if (segment.x === appleX &&
               segment.y === appleY) {
               validPos = false;
               break;
           }
       }
   }


   return {x: appleX, y: appleY}
}


function detectAppleCollision() {
   const HEAD_X = snake[snake.length - 1].x
   const HEAD_Y = snake[snake.length - 1].y


   if (HEAD_X === apple.x &&
       HEAD_Y === apple.y) {


       growNextTick = true;
       apple = getNewApplePos();
       lastAppleEatenTime = Date.now()
   }
}


function detectSnakeCollision() {
   const HEAD_X = snake[snake.length - 1].x
   const HEAD_Y = snake[snake.length - 1].y


   for (let i = 0; i < snake.length - 1; i++) {
       if (snake[i].x == HEAD_X && snake[i].y == HEAD_Y) {
           gamePlaying = false
       }
   }
}


function getGridIndex(x, y) {
   const xIdx = x - 1;
   const yIdx = y - 1;


   return xIdx + yIdx * X_BOUND;
}


function updateGrid() {
   grid.fill(false);


   if (gameType === "Snake") {
       for (const segment of snake) {
           grid[getGridIndex(segment.x, segment.y)] = true;
       }


       grid[getGridIndex(apple.x, apple.y)] = true;
   } else if (gameType === "Secret") {
       for (const barrier of barriers) {
           grid[getGridIndex(barrier.x, barrier.y)] = true;
       }


       grid[getGridIndex(1, playerPos)] = true;
   }
}


function generateChars() {
   for (let i = 0; i < X_BOUND; i += 2) {
       const IDX1 = i;
       const IDX2 = i + 1;
       const IDX3 = i + X_BOUND;
       const IDX4 = i + 1 + X_BOUND;
       const IDX5 = i + X_BOUND * 2;
       const IDX6 = i + 1 + X_BOUND * 2;
       const IDX7 = i + X_BOUND * 3;
       const IDX8 = i + 1 + X_BOUND * 3;


       let mask = 0;


       if (grid[IDX1]) mask |= 1;
       if (grid[IDX3]) mask |= 2;
       if (grid[IDX5]) mask |= 4;
       if (grid[IDX2]) mask |= 8;
       if (grid[IDX4]) mask |= 16;
       if (grid[IDX6]) mask |= 32;
       if (grid[IDX7]) mask |= 64;
       if (grid[IDX8]) mask |= 128;


       chars[i / 2] = String.fromCharCode(0x2800 + mask);
   }
}


function checkBoundaries() {
   const HEAD_X = snake[snake.length - 1].x;
   const HEAD_Y = snake[snake.length - 1].y;
   if (HEAD_X < 1 || HEAD_X > X_BOUND)
       gamePlaying = false;
   if (HEAD_Y < 1 || HEAD_Y > 4)
       gamePlaying = false;
}


function hungerSnake() {
   if (!isHungerMode)
       return;
   if (Date.now() - lastAppleEatenTime < HUNGER_TIME_MS)
       return;


   if (snake.length > 1) {
       snake.shift();


       lastAppleEatenTime = Date.now() - (HUNGER_TIME_MS - (HUNGER_TIME_MS / Math.max(1, 11 - snake.length)));
   } else {
       gamePlaying = false;
   }
}


function secretGame() {
   if (downHeld && !upHeld && playerPos < 4) {
       downPressed = 0;
       playerPos++;
   } else if (upHeld && !downHeld && playerPos > 1) {
       upPressed = 0;
       playerPos--;
   }


   for (let i = 0; i < barriers.length; i++) {
       barriers[i].x--;
   }


   barriers = barriers.filter(barrier => barrier.x >= 1);


   if (spaceUntilNextBarrier < 1) {
       const EMPTY = getRandomInt(1, 4);


       switch (EMPTY) {
           case 1:
               barriers.push({x: X_BOUND, y: 2, points: 1});
               barriers.push({x: X_BOUND, y: 3, points: 0});
               barriers.push({x: X_BOUND, y: 4, points: 0});
               break;
           case 2:
               barriers.push({x: X_BOUND, y: 1, points: 1});
               barriers.push({x: X_BOUND, y: 3, points: 0});
               barriers.push({x: X_BOUND, y: 4, points: 0});
               break;
           case 3:
               barriers.push({x: X_BOUND, y: 1, points: 1});
               barriers.push({x: X_BOUND, y: 2, points: 0});
               barriers.push({x: X_BOUND, y: 4, points: 0});
               break;
           default:
               barriers.push({x: X_BOUND, y: 1, points: 1});
               barriers.push({x: X_BOUND, y: 2, points: 0});
               barriers.push({x: X_BOUND, y: 3, points: 0});
               break;
       }


       spaceUntilNextBarrier = MAX_SPACE;
   } else {
       spaceUntilNextBarrier--;
   }


   for (const barrier of barriers) {
       if (barrier.x === 1 && barrier.y === playerPos) {
           gamePlaying = false;
           return;
       }
   }


   for (const barrier of barriers) {
       if (barrier.x === 1) {
           secretScore += barrier.points;
           break;
       }
   }
}


function tick() {
   setDirection();


   if (gameType === "Snake") {
       detectAppleCollision();
       setSnakePos();
       hungerSnake();
       checkBoundaries();


       if (!gamePlaying) {
           return;
       }


       detectSnakeCollision();
   } else if (gameType === "Secret") {
       secretGame();
   }


   updateGrid();
   generateChars();
}


async function update() {
   if (gameType === "Snake") {
     if (!gamePlaying) {
         await delayText("GG - SCORE: " + (snake.length - 1), 1750);
         document.title = ogTitle;
         gameStarting = false;
         return;
     }


     let intervalMS = isHardMode ? 1000 / (MAX_FPS * 2) : FRAME_INTERVAL_MS;


       requestAnimationFrame((currentTimeMs) => {
         const deltaTimeMs = currentTimeMs - previousTimeMs;


         if (deltaTimeMs >= intervalMS) {
           tick();
           previousTimeMs = currentTimeMs - (deltaTimeMs % intervalMS);
         }


         draw();
         update();
       });
   } else if (gameType === "Secret") {
         if (!gamePlaying) {
             await delayText("GG - SCORE: " + secretScore, 1750);
             document.title = ogTitle;
             gameStarting = false;
             return;
         }


       let intervalMS = 1000 / (MAX_FPS + gameSpeed);
       numLoopWait--;
       if (numLoopWait <= 0) {
           gameSpeed += GAME_SPEED_INCREMENT;
           numLoopWait = LOOP_WAIT;
       }


       requestAnimationFrame((currentTimeMs) => {
         const deltaTimeMs = currentTimeMs - previousTimeMs;


         if (deltaTimeMs >= intervalMS) {
           tick();
           previousTimeMs = currentTimeMs - (deltaTimeMs % intervalMS);
         }


         draw();
         update();
       });
   }
}


function draw() {
   document.title = chars.join('')
}

