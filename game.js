if(window.innerWidth <=768 && !localStorage.getItem("mobileAlertShown")) {
    alert("Best played on a laptop for better layout and controls");
    localStorage.setItem("mobileAlertShown" , "true");
}



const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let soundMuted = false;
let snake = [{x:5 , y:5}];
let direction = "right";
let gameOver = false;
let foodX = Math.floor(Math.random() * 20);
let foodY = Math.floor(Math.random() * 20);
let interval;
let score = 0;
let gameOverPlayed = false;

let optionsOpen = false;
let time=0;
let timeInterval;
let highScore = 0;
let wasPausedBeforeOptions = false;
let specialFood = null;
let specialTimer = null;
let specialStartTime = null;
let eatCount = 0;
let gameStarted = false;
let isPaused = false;
let isCountingDown = false;
let restartLocked = false;
let gameState = "menu";
let pausedTime = 0;
let isExiting = false;
let exitLocked = false;


const startBtn = document.getElementById("startBtn");
const countdownEl = document.getElementById("countdown");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startFx = new Audio("CountDownSoundTrack.mp3");
startFx.volume=0.6;

const tracks = [
    new Audio("MainSoundTrack01.mpeg"),
    new Audio("MainSoundTrack02.mpeg")
];
let currentTrackIndex = 0;
let currentTrack= tracks[currentTrackIndex];

const timeDisplay = document.getElementById("time");

const clickSound = new Audio("ClickSoundTrack.m4a");
clickSound.preload = "auto";

const appleImg = new Image();
appleImg.src = "Apple.jpg";

const orangeImg = new Image();
orangeImg.src = "Orange.jpg";

const snakeHeadImg = new Image();
const snakeHeadDefault = "SnackHeadU.png";
const snakeHeadBlue = "SnackHeadBlue.jpeg";
const snakeHeadRed = "SnackHeadRed.jpeg";



snakeHeadImg.src = snakeHeadDefault;

const eatAppleSound = new Audio("EatAppleSoundTrack.m4a");

const gameOverSounds = new Audio("GameOverSoundTrack.m4a");

let shopLocked = false;
let shopOpen = false;
setShopState(false);
updateShopUnlocks();

let snakeBodyColor = "lime";
let currentSkin = "default";


function setAboutState() {
    const aboutBtn = document.querySelector(".about-btn");
    if(!aboutBtn)
        return;

    if(isPaused || gameOver) {
        aboutBtn.style.pointerEvents = "auto";
        aboutBtn.style.opacity = "1";
    }
    else {
        aboutBtn.style.pointerEvents = "none";
        aboutBtn.style.opacity = "0.4";
    }
}


function toggleSound() {
    soundMuted = !soundMuted ;
    const muteBtn = document.getElementById("soundToggleBtn");
    if(soundMuted) {
        muteBtn.textContent = "Sound : Muted";
        muteBtn.style.background = "red";

        tracks.forEach(track => track.muted = true);
        clickSound.muted = true;
        eatAppleSound.muted = true;
        gameOverSounds.muted = true;
        startFx.muted = true;
    }

    else {
        tracks.forEach(track => track.muted = false);
        muteBtn.style.background = "#3498db";
        clickSound.muted = false;
        eatAppleSound.muted = false;
        gameOverSounds.muted = false;
        startFx.muted = false;
        muteBtn.textContent = "Sound : Not Muted";
    }

}

function showShopMessage(text) {
    const msg = document.getElementById("shopMessage");
    msg.textContent = text;
    msg.style.display = "block";
    setTimeout( () => {
        msg.style.display = "none";
    }, 2000);
}

function trySelectSkin(color) {
    if(color === "default" && currentSkin === "default") {
        showShopMessage("You already use it");
        return;
    }
    if(currentSkin === color) {
        showShopMessage("You already use it");
        return;
    }
    let required = color === "red" ? 100 : 200;
    if(highScore < required) {
        showShopMessage(`Need ${required} HighScore`);
        return;
    }
    setSnakeSkin(color);
    playClick();
    toggleShop();
}

function setSnakeSkin(color) {
    currentSkin = color;
    if(color === "blue") {
        snakeHeadImg.src = snakeHeadBlue;
        snakeBodyColor = "blue";
}
    else if(color === "red") {
        snakeHeadImg.src = snakeHeadRed;
        snakeBodyColor = "red";
    }
    else {
        snakeHeadImg.src = snakeHeadDefault;
        snakeBodyColor = "lime";
        currentSkin = "default";
    }
}

function updateShopUnlocks() {
    const redBtn = document.querySelector(".red-snake");
    const blueBtn = document.querySelector(".blue-snake");
    if(highScore < 100) {
        redBtn.style.opacity = "0.5";
        redBtn.style.cursor = "not-allowed";
    }

    else {
        redBtn.style.opacity = "1";
        redBtn.style.cursor = "pointer";
    }

    if(highScore < 200) {
        blueBtn.style.opacity = "0.5";
        blueBtn.style.cursor = "not-allowed";
    }
    else {
        blueBtn.style.opacity = "1";
        blueBtn.style.cursor = "pointer";
    }
}



function setShopState(lock) {
    const shopBtn = document.querySelector(".shop-btn");
    const shopMenu = document.getElementById("shopMenu");
    
    shopLocked = lock;
    if(lock) {
        shopBtn.style.opacity = "0.5";
        shopBtn.style.pointerEvents = "none";
    
    shopMenu.style.display = "none";
    shopOpen = false;
} else {
    shopBtn.style.opacity = "1";
    shopBtn.style.pointerEvents = "auto";
    shopBtn.style.cursor = "pointer";
    shopBtn.title = "";
  }
}  
function playClick() {
    if(soundMuted)
        return;
    tracks.forEach(t => t.volume = 0.2 );
    const sound =clickSound.cloneNode();
    sound.volume = 1;
    sound.play().catch( () => {});

    setTimeout( () => {
        tracks.forEach(t => t.volume = 0.4);
    },200);
}

function playMusic() {
    currentTrack.currentTime = 0;
    currentTrack.play();
    currentTrack.onended = ()  => {
        nextTrack();
        playMusic();
    }
}

function pauseMusic() {
    currentTrack.pause();
}

function resumeMusic() {
    currentTrack.play();
}

function stopMusic() {
    currentTrack.pause();
    currentTrack.currentTime = 0;
}

function openShop() {
    if(shopLocked)
        return;

    playClick();
    const menu = document.getElementById("shopMenu");
    shopOpen = true;
    menu.style.display = "flex";
    menu.style.visibility = "visible";
    menu.style.opacity = "1";
}

function toggleShop() {
    if(shopLocked)
        return;

    playClick();
    const menu = document.getElementById("shopMenu") ;
    if(menu.style.display === "flex")
        menu.style.display = "none";
    else
        menu.style.display = "flex";
}
   function goToAbout() {
    const sound = clickSound.cloneNode();
    sound.volume = 1;
    sound.play().catch( () => {});

    setTimeout( () => {
        window.location.href="https://aboutme38392.pages.dev";
      } , 250);
   }

function nextTrack() {
    currentTrack.pause();
    currentTrackIndex = (currentTrackIndex + 1)% tracks.length;
    currentTrack = tracks[currentTrackIndex];
}

function startTimer() {
    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
        time++;
        let minutes = String(Math.floor(time/60)).padStart(2,"0");
        let seconds = String(time %60).padStart(2,"0");
        timeDisplay.textContent = `${minutes}:${seconds}`;
    } , 1000);
}

function stopTimer() {
    clearInterval(timeInterval);
}

function pauseTimer() {
    clearInterval(timeInterval);
}

function resumeTimer() {
   clearInterval(timeInterval);
   timeInterval = setInterval( () => {
    time++;

    let minutes = String(Math.floor(time/60)).padStart(2,"0");
    let seconds = String(time % 60).padStart(2,"0");
    timeDisplay.textContent = `${minutes}:${seconds}`;
   },1000);
}

function showStartWarning() {
    const msg = document.getElementById("startWarning");
    msg.style.display = "block";

    setTimeout( () => {
        msg.style.display = "none";
    }, 1000);
}


function toggleOptions() {
    playClick();
    if(isCountingDown || gameState === "starting") {
        showStartWarning();
        return;
    }
   

    const menu = document.getElementById("optionsMenu");

    if(!optionsOpen) {
        optionsOpen = true;
        menu.style.display = "flex";
         
        wasPausedBeforeOptions = (isPaused && gameStarted);

            clearInterval(interval);
            pauseTimer();
            pauseMusic();
      if(gameStarted && gameState === "playing") {
            isPaused = true;
            startBtn.textContent = "Resume";
            
        }
            
            currentTrack.pause();

    } else {
        optionsOpen = false;
        menu.style.display = "none";
        if(!gameStarted || gameState !== "playing")
            return;
        if(!wasPausedBeforeOptions) {
            startGame();
            resumeTimer();
            resumeMusic();
            isPaused= false;
            startBtn.textContent = "Pause";
            currentTrack.play().catch(() => {});
        }
    }
}


document.getElementById("sizeSlider").addEventListener("input" , function() {
    let scale = this.value/100;
    document.getElementById("ZoomWrapper").style.transform = `scale(${scale})`;
});


function handleStartPause() {    
    if(gameState === "exiting") {
        return;
    }

    if(isCountingDown || gameOver) 
        return;

    if(!gameStarted) {
        startGameFlow();
        startBtn.textContent = "Pause";
        return;
    }

    if(!isPaused) {
        pauseMusic();
        clearInterval(interval);
        clearTimeout(specialTimer);
        pauseTimer();
        
        isPaused = true;
        startBtn.textContent = "Resume";
        setAboutState();
        draw();

        return;
    }

    else {
        resumeMusic();
        let pauseDuration = Date.now() - pausedTime;

        if(specialStartTime) {
            specialStartTime += pauseDuration;
        }

        if(specialFood && specialStartTime) {
            let elapsed = Date.now() - specialStartTime;
            let remaining = 7000 - elapsed;

            startGame();
            resumeTimer();
            isPaused=false;

            specialTimer = setTimeout(() => {
                specialFood = null;
                specialStartTime = null;
            }, remaining);
        }

        startGame();
        resumeTimer();
        isPaused = false;
        startBtn.textContent = "Pause";
        setAboutState();
    }
    
    playClick();
}

function startGameFlow() {
    setAboutState();
    gameState = "starting";
    updateShopUnlocks();
    setShopState(true); 
    stopMusic();

    exitLocked = true;
    setTimeout(() => {
        exitLocked = false;
    }, 4000);

    gameOver = false;
    draw();
    gameStarted = true;
    isCountingDown = true;

    let count = 3;
    countdownEl.textContent = count;

       startFx.currentTime = 0;
      startFx.play().catch( () => {});
    let countInterval = setInterval(() => {

        count--;

        if(count > 0)
            countdownEl.textContent = count;
        else if(count === 0) {
            countdownEl.textContent="Start!";
        }
        else
            countdownEl.textContent = "Start!";

        if(count < 0) {
            clearInterval(countInterval);
            countdownEl.textContent = "";

            isCountingDown = false;
            restartLocked = false;

            document.querySelector(".restart-btn").disabled = false;
            
            gameState = "playing";
            startGame();
            playMusic();
            time = 0;
            timeDisplay.textContent = "00:00";
            startTimer();
        }

    }, 1000);
}




function startGame() {
    gameState="playing";
    clearInterval(interval);
    interval = setInterval(gameLoop , 200);
}

function gameLoop() {
    if(gameState === "exiting")
        return;

    if(gameOver) {
        setShopState(false);
        if(!gameOverPlayed) {
         gameOverSounds.currentTime = 0;
         gameOverSounds.play().catch( () => {});
         gameOverPlayed = true;
         setAboutState();
        }
        stopTimer();
        stopMusic();
        clearInterval(interval);
        clearTimeout(specialTimer);
        return;
    }

    update();
    draw();
}


function draw() {
    ctx.clearRect(0 , 0 , 400 , 400);

   ctx.drawImage(
    appleImg , foodX * box , foodY * box , box , box
   );
   
    if(specialFood) {
        ctx.drawImage(
            orangeImg , specialFood.x * box , specialFood.y * box , box , box
        );
    }

   let head=snake[0];
   ctx.save() ;
   ctx.translate(head.x * box + box / 2 , head.y * box + box / 2);
   if(direction === "right") {
     ctx.rotate(0);
   }
   else if(direction === "down") {
     ctx.rotate(Math.PI / 2);
   }
   else if(direction === "left") {
     ctx.rotate(Math.PI);
   }
   else if(direction === "up") {
    ctx.rotate(-Math.PI / 2);
   } 
   ctx.drawImage(
    snakeHeadImg,
    - box /2 ,
    - box /2 ,
    box ,
    box  
   );    
   ctx.restore();

   ctx.fillStyle = snakeBodyColor;
    
    for(let i=1; i<snake.length ; i++) {
        let part = snake[i];
        ctx.fillRect(part.x*box , part.y*box  , box  , box );
    }

    if(gameOver) {
        ctx.fillStyle = "white";
        ctx.font="30px Arial";
        ctx.fillText("Game Over" , 110 , 200);
    }

    if(isPaused && !gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Pause" , 140 , 200);
    }
}

function update() {
    let head = {x:snake[0].x , y: snake[0].y};

    if(direction === "right") head.x++;
    if(direction === "left") head.x--;
    if(direction === "up") head.y--;
    if(direction === "down") head.y++;

    snake.unshift(head);

    
    if(head.x === foodX && head.y === foodY) {
        eatAppleSound.currentTime = 0;
        eatAppleSound.play().catch(() => {});
        eatCount++;

        if(eatCount % 6 === 0) {
            generateSpecialFood();
        }

        generateFood();

        score += 2;
        if(score > highScore) {
            highScore = score;
            updateShopUnlocks();
        }
        scoreDisplay.textContent = "Score: " + score.toString().padStart(4,"0");
        highScoreDisplay.textContent = "HighScore: " + highScore.toString().padStart(4,"0");
    }
    else {
        snake.pop();
    }

    

    if(head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20)
        gameOver = true;

    

    for(let i=1 ; i<snake.length ; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y)
            gameOver = true;
    }

    // special food
    if(specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        eatAppleSound.currentTime = 0;
        eatAppleSound.play().catch(() => {});

        let elapsed = (Date.now() - specialStartTime) / 1000;
        let points = 10 - Math.floor(elapsed*(8/7));
        if(points < 2) points = 2;

        score += points;
        if(score > highScore) {
            highScore = score;
            updateShopUnlocks();
        }
        scoreDisplay.textContent = "Score: " + score.toString().padStart(4,"0");
        highScoreDisplay.textContent = "HighScore: " + highScore.toString().padStart(4,"0");

        specialFood = null;
        specialStartTime = null;
    }
}


function generateFood() {
    let valid = false;

    while(!valid) {
        foodX = Math.floor(Math.random() * 20);
        foodY = Math.floor(Math.random() * 20);

        valid = true;

        for(let part of snake) {
            if(part.x === foodX && part.y === foodY) {
                valid = false;
                break;
            }
        }
    }
}

function generateSpecialFood() {
    let valid = false;

    while(!valid) {
        let x = Math.floor(Math.random()*20);
        let y = Math.floor(Math.random()*20);

        valid = true;

        for(let part of snake) {
            if(part.x === x && part.y === y) {
                valid = false;
                break;
            }
        }

        if(x === foodX && y === foodY)
             valid = false;

        if(valid) {
            specialFood = {x:x , y:y};
        }
    }

    specialStartTime = Date.now();

    clearTimeout(specialTimer);

    specialTimer = setTimeout(() => {
        specialFood = null;
        specialStartTime = null;
    }, 7000);
}

function setDirection(dir) {
    if(isExiting)
        return;

    if(direction === "left" && dir === "right") return;
    if(direction === "right" && dir === "left") return;
    if(direction === "up" && dir === "down") return;
    if(direction === "down" && dir === "up") return;

    direction = dir;
}



let restartCooldown = false;

function restartGame() {
    setAboutState();
    gameState = "menu";
    
   
    if(restartCooldown)
        return;
    
    restartCooldown = true;
    playClick();

    setTimeout( () => {
        restartCooldown= false;
    } , 4000);

    
    if(isExiting)
        return;

    if(restartLocked) 
        return;

    restartLocked = true;
     
    stopMusic();
    clearInterval(interval);
    clearTimeout(specialTimer);

    isPaused = false;
    gameStarted = false;
    gameOver = false;

    specialFood = null;
    specialStartTime = null;
    eatCount = 0;

    snake = [{x:5 , y:5}];
    direction = "right";

    score = 0;
    scoreDisplay.textContent = "Score: 0000";

    generateFood();

    startBtn.textContent = "Pause";
    ctx.clearRect(0,0,400,400);
    time=0;
    timeDisplay.textContent = "00:00";
    stopTimer();

    isCountingDown = false;
    restartLocked = false;
    gameStarted=false;
    isPaused= false;
    exitLocked = false;
    gameState = "starting";
    nextTrack();
    startGameFlow();
}

let exitLockedClick = false;
// let gameState = "menu";

function exitGame() {

   if(gameState === "exiting")
    return;

   gameState = "exiting";

  //  playClick();

    pauseTimer();
    stopMusic();

   
    isExiting = true;
    
    clearInterval(interval);
    clearTimeout(specialTimer);

    gameOver = true;   
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    loading.style.position = "fixed";
    loading.style.top = "50%";
    loading.style.left="50%";
    loading.style.transform = "translate(-50% , -50%)";
    loading.style.zIndex="99999";
    loading.style.fontSize = "30px";
    loading.style.color="white";
    
    
    ctx.clearRect(0 , 0 , canvas.width , canvas.height);
    canvas.style.display = "none";

    
     document.querySelector(".restart-btn").disabled = true;
         gameState = "exiting";

       requestAnimationFrame( () => {
        setTimeout( () => {
            window.location.href = "https://www.google.com";
       }, 1000);

       });
       setTimeout( () => {
        exitLockedClick = false;
       }, 500);
      
     } 

     