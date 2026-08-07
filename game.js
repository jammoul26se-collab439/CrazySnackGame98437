if(window.innerWidth <=768 && !localStorage.getItem("mobileAlertShown")) {
    alert("Best played on a laptop for better layout and controls");
    localStorage.setItem("mobileAlertShown" , "true");
}
let currentLanguage = "en";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let soundMuted = false;
let snake = [{x:5 , y:5} , {x:4 , y:5}];
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
const bombSound = new Audio("BombSound.mp4");
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
const boomImg = new Image();
boomImg.src = "Boom.jpeg";
let bomb = null ;
let bombTimer = null ;
let bombCount = 0 ;
snakeHeadImg.src = snakeHeadDefault;
const eatAppleSound = new Audio("EatAppleSoundTrack.m4a");
const gameOverSounds = new Audio("GameOverSoundTrack.m4a");
const snakeTailImg = new Image();
const snakeTailDefault = "SnackQueue.jpeg";
const snakeTailRed = "SnackQueueRed.jpeg";
const snakeTailBlue = "SnackQueueBlue.jpeg";
snakeTailImg.src = snakeTailDefault ;
let gameSpeed = "normal";
let shopLocked = false;
let shopOpen = false;
setShopState(false);
updateShopUnlocks();
let snakeBodyColor = "lime";
let currentSkin = "default";
   const translations = {
    en: {
        start: "Start", restart: "Restart", options: "Options",  shop: "Shop",  about: "About Us", exit: "Exit", score: "Score", highScore: "HighScore", gameOver: "Game Over", up: "Up", left: "Left", right: "Right", down: "Down", version: "Version 1.77" , pause: "Pause", resume: "Resume", optionsTitle: "Options", soundMuted: "Sound : Muted", soundNotMuted: "Sound : Not Muted", language: "Language", screenSize: "Screen Size", close: "Close" , shopTitle: "Shop", redSnake: "Red Snake", blueSnake: "Blue Snake", defaultSnake: "Default Snake", shopClose: "Close", needHighScore: "Need {score} HighScore", alreadyUsing: "You already use it" , startCountdown: "Start!" , speedNormal: "Speed : Normal",  speedHard: "Speed : Hard",  speedEasy: "Speed : Easy" , qrButton: "Game QR Code", qrTitle: "Scan Crazy Snake Game", qrClose: "Close"
    },
    ar: {
        start: "إبدأ", restart: "إعادة تشغيل", options: "الإعدادات", shop: "السوق", about: "معلومات عنا", exit: "الخروج", score: "النقاط", highScore: "أفضل نتيجة", gameOver: "انتهت اللعبة", up: "أعلى", left: "يسار", right: "يمين", down: "أسفل", version: "الإصدار 1.77" , pause: "إيقاف مؤقت", resume: "متابعة", optionsTitle: "الإعدادات", soundMuted: "الصوت : مكتوم", soundNotMuted: "الصوت : غير مكتوم", language: "اللغة",  screenSize: "حجم الشاشة", close: "إغلاق" , shopTitle: "السوق", redSnake: "الثعبان الأحمر", blueSnake: "الثعبان الأزرق", defaultSnake: "الثعبان الافتراضي", shopClose: "إغلاق", needHighScore: "تحتاج إلى أفضل نتيجة {score}", alreadyUsing: "أنت تستخدمه بالفعل" , startCountdown: "ابدأ!" , speedNormal: "السرعة : عادية", speedHard: "السرعة : صعبة", speedEasy: "السرعة : سهلة" , qrButton: "رمز QR للعبة", qrTitle: "امسح رمز لعبة Crazy Snake", qrClose: "إغلاق"
    },
    ru: {
        start: "Начните", restart: "Перезагрузите", options: "Варианты", shop: "Магазин", about: "О нас", exit: "Выход", score: "Счёт", highScore: "Рекорд", gameOver: "Игра окончена", up: "Вверх", left: "Влево", right: "Вправо", down: "Вниз", version: "Версия 1.77" , pause: "Пауза", resume: "Продолжить", optionsTitle: "Настройки",soundMuted: "Звук : Выкл", soundNotMuted: "Звук : Вкл", language: "Язык", screenSize: "Размер экрана", close: "Закрыть" , shopTitle: "Магазин", redSnake: "Красная Змея", blueSnake: "Синяя Змея", defaultSnake: "Стандартная Змея", shopClose: "Закрыть", needHighScore: "Нужно {score} очков рекорда", alreadyUsing: "Вы уже используете её" , startCountdown: "Старт!" , speedNormal: "Скорость : Нормальная", speedHard: "Скорость : Сложная", speedEasy: "Скорость : Лёгкая" , qrButton: "QR-код игры", qrTitle: "Сканировать игру Crazy Snake", qrClose: "Закрыть"

     },
    es: {
        start: "Iniciar", restart: "Reiniciar", options: "Opciones", shop: "Comprar", about: "Acerca de nosotros", exit: "Salir", score: "Puntuación", highScore: "Récord", gameOver: "Fin del juego", up: "Arriba", left: "Izquierda", right: "Derecha", down: "Abajo", version: "Versión 1.77" , pause: "Pausa", resume: "Continuar", optionsTitle: "Opciones", soundMuted: "Sonido : Silenciado", soundNotMuted: "Sonido : Activado", language: "Idioma", screenSize: "Tamaño de pantalla", close: "Cerrar" , shopTitle: "Tienda", redSnake: "Serpiente Roja", blueSnake: "Serpiente Azul", defaultSnake: "Serpiente Predeterminada", shopClose: "Cerrar", needHighScore: "Se necesita {score} de récord", alreadyUsing: "Ya la estás usando" , startCountdown: "¡Iniciar!" , speedNormal: "Velocidad : Normal", speedHard: "Velocidad : Difícil",  speedEasy: "Velocidad : Fácil" , qrButton: "Código QR del juego", qrTitle: "Escanear Crazy Snake Game", qrClose: "Cerrar"
},
    fr: {
        start: "Démarrer", restart: "Redémarrer", options: "Options", shop: "Acheter", about: "À propos de nous", exit: "Quitter", score: "Score", highScore: "Meilleur score", gameOver: "Partie terminée", up: "Haut", left: "Gauche", right: "Droite", down: "Bas", version: "Version 1.77" , pause: "Pause", resume: "Reprendre", optionsTitle: "Options", soundMuted: "Son : Coupé", soundNotMuted: "Son : Activé", language: "Langue", screenSize: "Taille de l'écran", close: "Fermer" , shopTitle: "Boutique", redSnake: "Serpent Rouge", blueSnake: "Serpent Bleu", defaultSnake: "Serpent Par Défaut", shopClose: "Fermer", needHighScore: "Score requis : {score}", alreadyUsing: "Vous l'utilisez déjà", startCountdown: "Démarrer !" , speedNormal: "Vitesse : Normale" , speedHard: "Vitesse : Difficile" , speedEasy: "Vitesse : Facile" , qrButton: "Code QR du jeu", qrTitle: "Scanner le jeu Crazy Snake", qrClose: "Fermer" 
}
};
function toggleSpeedMenu() {
    playClick();
    const btn = document.getElementById("speedBtn");
    if(gameSpeed === "normal") {
        gameSpeed = "hard";
        btn.textContent = translations[currentLanguage].speedHard;
    }
    else if(gameSpeed === "hard") {
        gameSpeed = "easy";
        btn.textContent = translations[currentLanguage].speedEasy;
    }
    else {
        gameSpeed = "normal";
        btn.textContent = translations[currentLanguage].speedNormal;
    }
    if(gameStarted && !isPaused && !gameOver) {
        startGame();
    }
}
function applyLanguage(lang) {
    const t = translations[lang];
    if(!t) return;
    if(!gameStarted) 
        startBtn.textContent = t.start ;
    else if(isPaused) 
        startBtn.textContent = t.resume ;
    else 
        startBtn.textContent = t.pause ;
    document.querySelector(".restart-btn").textContent = t.restart ;
    document.querySelector(".options-btn").textContent = t.options ;
    document.querySelector(".shop-btn").textContent = t.shop ;
    document.querySelector(".about-btn").textContent = t.about ;
    document.querySelector(".exit-btn").textContent = t.exit;
    document.getElementById("upBtn").textContent = t.up;
    document.getElementById("leftBtn").textContent = t.left;
    document.getElementById("rightBtn").textContent = t.right;
    document.getElementById("downBtn").textContent = t.down;
    document.querySelector(".version-label").textContent = t.version;
    scoreDisplay.textContent = `${t.score}: ${score.toString().padStart(4,"0")}`;
    highScoreDisplay.textContent = `${t.highScore} : ${highScore.toString().padStart(4,"0")}` ;
    document.getElementById("optionsTitle").textContent = t.optionsTitle ;
    document.getElementById("languageBtn").textContent = t.language ;
    document.getElementById("screenSizeLabel").textContent = t.screenSize ;
    document.querySelector("#shopMenu h2").textContent = t.shopTitle;
    document.querySelector(".red-snake").textContent = t.redSnake;
    document.querySelector(".blue-snake").textContent = t.blueSnake;
    document.querySelector(".default-snake").textContent = t.defaultSnake;
    document.getElementById("gameQRBtn").textContent = t.qrButton;
    document.getElementById("qrTitle").textContent = t.qrTitle;
    document.getElementById("closeQRBtn").textContent = t.qrClose;
    const closeBtn = document.getElementById("closeBtn");
    if(closeBtn)
        closeBtn.textContent = t.close;
    const shopCloseBtn = document.getElementById("shopCloseBtn");
    if(shopCloseBtn)
        shopCloseBtn.textContent = t.shopClose;
    const soundBtn = document.getElementById("soundToggleBtn");
    if(soundMuted)
        soundBtn.textContent = t.soundMuted;
    else
        soundBtn.textContent = t.soundNotMuted;
    const speedBtn = document.getElementById("speedBtn");
    if(gameSpeed === "normal")
        speedBtn.textContent = t.speedNormal;
    else if(gameSpeed === "hard")
        speedBtn.textContent = t.speedHard;
    else
        speedBtn.textContent = t.speedEasy;

    const buttons = document.querySelectorAll(".buttons button , .controls button , .shop-item");
    buttons.forEach(btn => {
        if(lang === "ru") {
            if(window.innerWidth <= 600) 
              btn.style.fontSize = "5px";
            else
            btn.style.fontSize = "12px";
        }
        else {
            btn.style.fontSize = "";
        }
    });
}
function toggleLanguageMenu() {
    playClick();
    const menu = document.getElementById("languageMenu");
    if(menu.style.display === "block")
        menu.style.display = "none";
    else
        menu.style.display = "block";
}
function selectLanguage(lang) {
    currentLanguage = lang;
    document.getElementById("languageMenu").style.display = "none";
    applyLanguage(lang);
}
function setAboutState() {
    const aboutBtn = document.querySelector(".about-btn");
    if(!aboutBtn)
        return;
    aboutBtn.style.pointerEvents = "auto";
    aboutBtn.style.opacity = "1";
}

function toggleSound() {
    soundMuted = !soundMuted ;
    const muteBtn = document.getElementById("soundToggleBtn");
    if(soundMuted) {
        muteBtn.textContent = translations[currentLanguage].soundMuted;
        muteBtn.style.background = "red";
        tracks.forEach(track => track.muted = true);
        clickSound.muted = true;
        eatAppleSound.muted = true;
        gameOverSounds.muted = true;
        startFx.muted = true;
        bombSound.muted = true;
    }
    else {
        tracks.forEach(track => track.muted = false);
        muteBtn.style.background = "#3498db";
        clickSound.muted = false;
        eatAppleSound.muted = false;
        gameOverSounds.muted = false;
        startFx.muted = false;
        bombSound.muted = false;
        muteBtn.textContent = translations[currentLanguage].soundNotMuted;
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
        showShopMessage(translations[currentLanguage].alreadyUsing);
        return;
    }
    if(currentSkin === color) {
        showShopMessage(translations[currentLanguage].alreadyUsing);
        return;
    }
    let required = color === "red" ? 100 : 200;
    if(highScore < required) {
        showShopMessage(translations[currentLanguage].needHighScore.replace("{score}" , required));
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
        snakeTailImg.src = snakeTailBlue;
        snakeBodyColor = "blue";
}
    else if(color === "red") {
        snakeHeadImg.src = snakeHeadRed;
        snakeTailImg.src = snakeTailRed;
        snakeBodyColor = "red";
    }
    else {
        snakeHeadImg.src = snakeHeadDefault;
        snakeTailImg.src = snakeTailDefault;
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
        window.location.href="https://mypersonalmainpage5600.jammoul26se.workers.dev/";
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
            startBtn.textContent = translations[currentLanguage].pause;
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
        startBtn.textContent = translations[currentLanguage].pause;
        return;
    }
    if(!isPaused) {
        pauseMusic();
        clearInterval(interval);
        clearTimeout(specialTimer);
        pauseTimer();
        
        isPaused = true;
       startBtn.textContent = translations[currentLanguage].resume;
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
        startBtn.textContent = translations[currentLanguage].pause;
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
            countdownEl.textContent= translations[currentLanguage].startCountdown;
        }
        else
            countdownEl.textContent = translations[currentLanguage].startCountdown;
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
    let speed;
    if(gameSpeed === "easy")
        speed = 400;
    else if(gameSpeed === "hard")
        speed = 100;
    else
        speed = 200;
    interval = setInterval(gameLoop , speed);
}
function gameLoop() {
    if(gameState === "exiting")
        return;
    if(gameOver) {
        setShopState(false);
        if(!gameOverPlayed) {
         gameOverSounds.currentTime = 0;
          setAboutState();
         gameOverSounds.play().catch( () => {});
         gameOverPlayed = true;
        }
        stopTimer();
        stopMusic();
        clearInterval(interval);
        clearTimeout(specialTimer);
        clearTimeout(bombTimer);
        bomb = null;
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
    if(bomb) {
        ctx.drawImage(
            boomImg , bomb.x * box , bomb.y * box , box , box
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
    for(let i=1; i<snake.length -1 ; i++) {
        let part = snake[i];
        ctx.fillRect(part.x*box , part.y*box  , box  , box );
    }
    let tail = snake[snake.length -1];
    let tailDir;
    if(snake.length === 1) 
        tailDir = direction;
    else {
        let beforeTail = snake[snake.length - 2];
        if(beforeTail.x > tail.x)
            tailDir = "right";
        else if(beforeTail.x < tail.x)
            tailDir = "left";
        else if(beforeTail.y > tail.y)
            tailDir = "down";
        else
            tailDir = "up";
    }
    ctx.save();
    ctx.translate(
        tail.x * box + box/2 , tail.y * box + box/2
    );
    switch(tailDir) {
        case "right" :
            ctx.rotate(0);
            break;
        case "down" :
            ctx.rotate(Math.PI/2)
            break;
        case "left":
            ctx.rotate(Math.PI);
            break;
        case "up":
            ctx.rotate(-Math.PI/2);
            break;
    }
    ctx.drawImage(
        snakeTailImg , -box/2 , - box/2 , box , box
    );
    ctx.restore();
    if(gameOver) {
        ctx.fillStyle = "white";
        ctx.font="30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(translations[currentLanguage].gameOver , 200 , 200);
        ctx.textAlign = "start" ;
    }
    if(isPaused && !gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(translations[currentLanguage].pause , canvas.width/2 , canvas.height/2);
        ctx.textAlign = "start";
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
        if(eatCount % 5 == 0) {
            generateBomb();
        }
        generateFood();
        score += 2;
        if(score > highScore) {
            highScore = score;
            updateShopUnlocks();
        }
        scoreDisplay.textContent = `${translations[currentLanguage].score}: ${score.toString().padStart(4,"0")}`;
        highScoreDisplay.textContent = `${translations[currentLanguage].highScore}: ${highScore.toString().padStart(4,"0")}`;
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
       scoreDisplay.textContent = `${translations[currentLanguage].score}: ${score.toString().padStart(4,"0")}`;
        highScoreDisplay.textContent = `${translations[currentLanguage].highScore}: ${highScore.toString().padStart(4,"0")}`;
        specialFood = null;
        specialStartTime = null;
    }
    if(bomb && head.x === bomb.x && head.y === bomb.y) {
        bombSound.currentTime = 0;
        bombSound.play().catch(() => {});
        gameOver = true;
        bomb = null;
        clearTimeout(bombTimer);
    }
}
function generateBomb() {
    let valid = false ;
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
        if(bomb && foodX === bomb.x && foodY === bomb.y)
        valid = false;
        if(x === foodX && y === foodY)
            valid = false;
        if(specialFood && x === specialFood.x &&  y === specialFood.y)
            valid = false;
        if(valid) 
            bomb = {x:x , y:y};
    }
    clearTimeout(bombTimer);
    bombTimer = setTimeout(() => {
        bomb = null;
    } , 5000);
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
        if(bomb && x === bomb.x && y === bomb.y)
            valid = false;
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
    bomb = null;
    clearTimeout(bombTimer);
    bombCount = 0;
    snake = [{x:5 , y:5} , {x:4 , y:5}];
    direction = "right";
    score = 0;
    scoreDisplay.textContent = `${translations[currentLanguage].score}:0000`;
    generateFood();
    startBtn.textContent = translations[currentLanguage].start;
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
function exitGame() {
   if(gameState === "exiting")
    return;
   gameState = "exiting";
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
     document.addEventListener("keydown" , function(event) {
        switch(event.key) {
          case "ArrowUp" :
            event.preventDefault();
            setDirection("up");
            break;
        case "ArrowDown" :
            event.preventDefault();
            setDirection("down");
            break;
        case "ArrowLeft" :
            event.preventDefault();
            setDirection("left");
            break;
        case "ArrowRight" :
            event.preventDefault();
            setDirection("right");
            break;
        }
     });
     document.getElementById("gameQRBtn").addEventListener("click" , function() {
        playClick();
        document.getElementById("qrModal").style.display = "flex" ;
     });
     document.getElementById("closeQRBtn").addEventListener("click" , function() {
        playClick();
        document.getElementById("qrModal").style.display = "none" ;
     });