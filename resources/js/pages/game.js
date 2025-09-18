const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
let startScreenImage = new Image();

const currentLang = document.documentElement.lang || 'en';
let translations = {};
let currentDialogueText = '';
let jackCurrentDialogue = '';

async function loadTranslations() {
  try {
    const response = await fetch('translations/translations.json');
    const data = await response.json();

    translations = data[currentLang]?.game || {};

    if (!translations.dialogues) {
      console.error('Aucun dialogue chargé');
    }
    initializeDialogues();
    applyTranslations();
    showStartScreen();
  } catch (error) {
    console.error('Erreur lors du chargement des traductions :', error);
  }
}

function initializeDialogues() {
  currentDialogueText = translations.dialogues?.genji_success || 'Text Missing';
  jackCurrentDialogue = translations.dialogues?.jack_intro || 'Text Missing';
}

window.addEventListener('load', () => {
  loadTranslations();
});

function applyTranslations() {
  document.getElementById('restartButton').innerHTML = translations.restart_button;
  scoreDisplay.innerHTML = translations.score + '0';
  highScoreDisplay.innerHTML = translations.highest_score + '0';
  restartButton.innerHTML = translations?.restart_button || 'Restart';
  scoreDisplay.innerHTML = `${translations?.score || 'Score'} 0`;
  highScoreDisplay.innerHTML = `${translations?.highest_score || 'Highest score'} 0`;
}

const sounds = {
  gameRunning: new Audio('assets/sounds/gameRunning.ogg'),
  gameFreemode: new Audio('assets/sounds/gameFreemode.ogg'),
  genjiJump: new Audio('assets/sounds/genjiJump.ogg'),
  genjiDead: new Audio('assets/sounds/genjiDead.ogg'),
  genjiKilled: new Audio('assets/sounds/genjiKilled.ogg'),
  gameDial: new Audio('assets/sounds/gameDial.ogg'),
};

sounds.gameRunning.loop = true;
sounds.gameFreemode.loop = true;
Object.values(sounds).forEach((a) => {
  a.preload = 'auto';
});

function stopAllSounds(except = null) {
  for (const a of Object.values(sounds)) {
    if (a !== except) {
      a.pause();
      a.currentTime = 0;
    }
  }
}

function safePlay(audio) {
  if (!audio) return;
  const p = audio.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

canvas.width = 800;
canvas.height = 200;

let gameRunning = false;
let postGameOverTimeout = null;
let genjiDead = null;
let isGenjiDead = false;
let genji = { x: 50, y: 150, width: 60, height: 80, velocityY: 0, isJumping: false };
let gravity = 0.5;
let obstacles = [];
let obstacleGenerationCooldown = 120;
let frameCount = 0;
let score = 0;
let highScore = 0;
let animationFrame;
let isFreeMode = false;
let isMoving = false;
let maxScoreReached = false;
let genjiDirection = 'right';
let sprintFrames = [];
let sprintFramesLeft = [];
let jumpFrames = [];
let genjiNeutral = null;
let mercyFrames = [];
let mercyStandFrames = [];
let hasShownJackWarning = false;
let genjiFrameIndex = 0;
let genjiJumpFrameIndex = 0;
let mercyFrameIndex = 0;
let jackPosition = { x: canvas.width / 2 + 50, y: canvas.height - 90 };
let jackNeutralFrames = [];
let isJackVisible = false;
let jackNextDialogueTimeout;
let jackCurrentFrameIndex = 0;
let isNowDieVisible = false;
let jackGuardFrames = [];
let isJackGuarding = false;
let jackGuardFrameIndex = 0;
let jackAttackFrames = [];
let jackAttackAnimationInProgress = false;
let jackAttackFrameIndex = 0;
let jackKilledGenji = false;
let jackState = 'neutral1';
let jackLastFrameTime = 0;
let jackFrameSpeed = 300;
let jackStartTime = performance.now();
let maxScore = 10000;
const genjiYOffset = -30;
const keyPressed = {};

const backgroundImage = new Image();
backgroundImage.src = 'assets/404/background.png';

const obstacleGroups = {
  group1: [
    'assets/404/obstacles/obstacle1.png',
    'assets/404/obstacles/obstacle2.png',
    'assets/404/obstacles/obstacle3.png',
  ].map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  }),
  group2: [
    'assets/404/obstacles/obstacle4.png',
    'assets/404/obstacles/obstacle5.png',
    'assets/404/obstacles/obstacle6.png',
  ].map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  }),
  group3: [
    'assets/404/obstacles/obstacle7.png',
    'assets/404/obstacles/obstacle8.png',
    'assets/404/obstacles/obstacle9.png',
  ].map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  }),
  group4: ['assets/404/obstacles/obstacle10.png', 'assets/404/obstacles/obstacle11.png'].map(
    (src) => {
      const img = new Image();
      img.src = src;
      return img;
    }
  ),
};

function drawBackground() {
  const bgWidth = backgroundImage.width;
  const bgHeight = backgroundImage.height;
  const canvasRatio = canvas.width / canvas.height;
  const bgRatio = bgWidth / bgHeight;

  let drawWidth, drawHeight;

  if (bgRatio > canvasRatio) {
    drawHeight = canvas.height;
    drawWidth = bgWidth * (canvas.height / bgHeight);
  } else {
    drawWidth = canvas.width;
    drawHeight = bgHeight * (canvas.width / bgWidth);
  }

  const offsetX = (drawWidth - canvas.width) / 2;
  const offsetY = drawHeight - canvas.height;

  ctx.drawImage(backgroundImage, -offsetX, -offsetY, drawWidth, drawHeight);
}

function drawGenji() {
  if (isGenjiDead) {
    ctx.drawImage(genjiDead, genji.x, genji.y + 10, 80, 40);
    return;
  }

  const shouldAnimate = isMoving || score < maxScore;

  if (genji.isJumping) {
    ctx.drawImage(
      jumpFrames[genjiJumpFrameIndex],
      genji.x,
      genji.y + genjiYOffset,
      genji.width,
      genji.height
    );

    if (frameCount % 10 === 0) {
      genjiJumpFrameIndex = (genjiJumpFrameIndex + 1) % jumpFrames.length;
    }
  } else if (shouldAnimate) {
    const defaultFrame = genjiNeutral;
    const frames = genjiDirection === 'right' ? sprintFrames : sprintFramesLeft;
    const frame = frames.length > 0 ? frames[genjiFrameIndex] : defaultFrame;
    if (frame && frame.complete && frame.naturalWidth > 0) {
      ctx.drawImage(frame, genji.x, genji.y + genjiYOffset, genji.width, genji.height);
    }

    if (frameCount % 10 === 0) {
      genjiFrameIndex = (genjiFrameIndex + 1) % frames.length;
    }
  } else {
    ctx.drawImage(genjiNeutral, genji.x, genji.y + genjiYOffset, genji.width, genji.height);
  }
}

function drawMercy() {
  const mercyX = canvas.width - 100;
  const mercyY = isFreeMode ? 120 : 20;
  const mercyWidth = 60;
  const mercyHeight = 80;
  const mercyName = translations.characters?.mercy || 'Mercy';

  const frames = isFreeMode ? mercyStandFrames : mercyFrames;
  const frame = frames[mercyFrameIndex];

  if (frame && frame.complete && frame.naturalWidth > 0) {
    ctx.drawImage(frame, mercyX, mercyY, mercyWidth, mercyHeight);
  }

  if (isFreeMode) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(mercyName, mercyX + mercyWidth / 2, mercyY - 10);

    if (isGenjiDead) {
      drawDialogue(mercyX + mercyWidth / 2, mercyY, 'genji_dead');
    } else if (isJackVisible) {
      drawDialogue(mercyX + mercyWidth / 2, mercyY, 'mercy_warning');
    } else {
      drawDialogue(mercyX + mercyWidth / 2, mercyY, 'genji_success');
    }
  }

  if (frameCount % 15 === 0) {
    mercyFrameIndex = (mercyFrameIndex + 1) % frames.length;
  }
}

function drawJack() {
  if (!isJackVisible) return;

  const jackWidth = 90;
  const jackHeight = 90;
  const currentTime = performance.now();
  const genjiName = translations.characters?.genji || 'Genji';
  const jackName = translations.characters?.jack || 'Jack';

  if (isJackVisible) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(genjiName, genji.x + genji.width / 2, genji.y + genjiYOffset - 10);
    ctx.fillText(jackName, jackPosition.x + 45, jackPosition.y - 10);
  }

  if (isJackVisible && !jackNextDialogueTimeout) {
    jackCurrentDialogue = 'jack_intro';
    drawDialogue(jackPosition.x + jackWidth / 2, jackPosition.y - 10, jackCurrentDialogue);

    jackNextDialogueTimeout = setTimeout(() => {
      jackCurrentDialogue = 'now_die';
      drawDialogue(jackPosition.x + jackWidth / 2, jackPosition.y - 10, jackCurrentDialogue);

      setTimeout(() => {
        jackCurrentDialogue = '';
      }, 500);
    }, 1500);
  }

  const distance = Math.abs(genji.x - jackPosition.x);

  if (distance <= 80 && !jackAttackAnimationInProgress) {
    jackState = 'attack';
    jackAttackFrameIndex = 0;
    jackAttackAnimationInProgress = true;
    isGenjiDead = true;
    jackKilledGenji = true;
  } else if (distance <= 250 && !jackAttackAnimationInProgress) {
    jackState = 'guard';
    jackGuardFrameIndex = distance <= 240 ? 1 : 0;
  } else if (!jackAttackAnimationInProgress) {
    jackState = 'neutral1';
  }

  let frame;
  switch (jackState) {
    case 'neutral1':
      frame = jackNeutralFrames[0];
      break;
    case 'neutral2':
      frame = jackNeutralFrames[1];
      break;
    case 'guard':
      frame = jackGuardFrames[jackGuardFrameIndex];
      break;
    case 'attack':
      frame = jackAttackFrames[jackAttackFrameIndex];
      if (currentTime - jackLastFrameTime > 150) {
        jackAttackFrameIndex++;
        jackLastFrameTime = currentTime;

        if (jackAttackFrameIndex >= jackAttackFrames.length) {
          jackAttackAnimationInProgress = false;
          jackState = 'neutral1';
        }
      }
      break;
  }

  if (frame && frame.complete && frame.naturalWidth > 0) {
    ctx.drawImage(frame, jackPosition.x, jackPosition.y, jackWidth, jackHeight);
  }

  if (jackState === 'attack') {
    jackPosition.x -= 2;
  }

  if (jackCurrentDialogue) {
    drawDialogue(jackPosition.x + jackWidth / 2, jackPosition.y - 10, jackCurrentDialogue);
  }
}

function drawCharacters() {
  if (isFreeMode) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';

    ctx.fillText(
      translations.characters.genji,
      genji.x + genji.width / 2,
      genji.y + genjiYOffset - 10
    );
    ctx.fillText(translations.characters.jack, jackPosition.x + 45, jackPosition.y - 10);
    ctx.fillText(translations.characters.mercy, mercyX + mercyWidth / 2, mercyY - 10);
  }
}

function drawDialogue(x, y, key) {
  const text = translations.dialogues?.[key] || 'Text Missing';

  const padding = 10;
  const fontSize = 14;
  ctx.font = `${fontSize}px Arial`;
  const textWidth = ctx.measureText(text).width;

  const bubbleWidth = textWidth + 2 * padding;
  const bubbleHeight = fontSize + 2 * padding;

  const bubbleX = x - bubbleWidth / 2;
  const bubbleY = y - bubbleHeight - 30;

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);
  ctx.fill();
  ctx.stroke();

  const tailWidth = 10;
  const tailHeight = 15;
  const tailX = x;
  const tailYStart = bubbleY + bubbleHeight;
  const tailYEnd = tailYStart + tailHeight;

  ctx.beginPath();
  ctx.moveTo(tailX, tailYEnd);
  ctx.lineTo(tailX - tailWidth / 2, tailYStart);
  ctx.lineTo(tailX + tailWidth / 2, tailYStart);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, bubbleY + bubbleHeight / 2);
}

function getObstacleImage() {
  if (score < 2000) {
    return obstacleGroups.group1[Math.floor(Math.random() * obstacleGroups.group1.length)];
  } else if (score < 5000) {
    return obstacleGroups.group2[Math.floor(Math.random() * obstacleGroups.group2.length)];
  } else if (score < 8000) {
    return obstacleGroups.group3[Math.floor(Math.random() * obstacleGroups.group3.length)];
  } else {
    return obstacleGroups.group4[Math.floor(Math.random() * obstacleGroups.group4.length)];
  }
}

function generateObstacle() {
  const obstacleImage = getObstacleImage();
  const obstacle = {
    x: canvas.width,
    y: 150,
    width: 50,
    height: 50,
    image: obstacleImage,
  };
  obstacles.push(obstacle);
}

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x -= 6;

    ctx.drawImage(obs.image, obs.x, obs.y, obs.width, obs.height);

    if (obs.x + obs.width < 0) obstacles.splice(i, 1);
  }
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (isGenjiDead) {
    drawGenji();
    drawMercy();
    drawJack();

    if (!postGameOverTimeout) {
      postGameOverTimeout = performance.now();
    }

    if (jackAttackAnimationInProgress) {
      animationFrame = requestAnimationFrame(updateGame);
      return;
    }

    if (performance.now() - postGameOverTimeout > 1) {
      displayGameOver();
      return;
    }
  }

  if (!gameRunning && isGenjiDead) {
    drawGenji();
    drawMercy();
    drawJack();
    drawObstacles();

    if (!postGameOverTimeout) {
      postGameOverTimeout = performance.now();
    }
    if (performance.now() - postGameOverTimeout > 2000) {
      cancelAnimationFrame(animationFrame);
      return;
    }
    animationFrame = requestAnimationFrame(updateGame);
    return;
  }

  if (gameRunning) {
    genji.velocityY += gravity;
    genji.y += genji.velocityY;

    if (genji.y >= 150) {
      genji.y = 150;
      genji.isJumping = false;
    }

    if (isFreeMode) {
      if (!isJackVisible) {
        setTimeout(() => {
          isJackVisible = true;
        }, 2000);
      }
      const jackX = canvas.width / 2 + 50;
      const distance = Math.abs(genji.x - jackX);
      isJackGuarding = distance < 200;

      if (isJackVisible) {
        if (keyPressed['q'] || keyPressed['a'] || keyPressed['arrowleft']) {
          genji.x = Math.max(0, genji.x - 2);
        }
        if (keyPressed['d'] || keyPressed['arrowright']) {
          genji.x = Math.min(canvas.width - genji.width, genji.x + 2);
        }
      }
    }

    drawGenji();
    drawMercy();
    drawJack();

    if (!isFreeMode) {
      drawObstacles();
      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (
          genji.x < obs.x + obs.width &&
          genji.x + genji.width > obs.x &&
          genji.y + genjiYOffset < obs.y + obs.height &&
          genji.y + genjiYOffset + genji.height > obs.y
        ) {
          gameRunning = false;
          isGenjiDead = true;
          highScore = Math.max(highScore, score);
          displayGameOver();
          return;
        }
      }
    }

    if (!isFreeMode && frameCount % obstacleGenerationCooldown === 0) {
      generateObstacle();
    }

    if (score >= maxScore) {
      isFreeMode = true;
      obstacles = [];
      maxScoreReached = true;

      stopAllSounds(sounds.gameFreemode);
      safePlay(sounds.gameFreemode);
    }

    if (!maxScoreReached) {
      score++;
    }

    scoreDisplay.textContent = `${translations.score} ${score}`;
    highScoreDisplay.textContent = `${translations.highest_score} ${highScore}`;

    frameCount++;
  }

  animationFrame = requestAnimationFrame(updateGame);
}

function displayGameOver() {
  const gameOverText = translations?.gameplay?.game_over || 'GAME OVER';
  const restartPromptText = translations?.gameplay?.restart_prompt || 'Press Restart to play again';

  if (jackKilledGenji) {
    stopAllSounds(sounds.genjiKilled);
    sounds.genjiKilled.currentTime = 0;
    safePlay(sounds.genjiKilled);
    setTimeout(() => {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameOverText, canvas.width / 2, canvas.height / 2 + 50);
      ctx.font = '16px Arial';
      ctx.fillText(restartPromptText, canvas.width / 2, canvas.height / 2 + 80);

      gameRunning = false;
      cancelAnimationFrame(animationFrame);
    }, 2000);
  } else {
    stopAllSounds(sounds.genjiDead);
    sounds.genjiDead.currentTime = 0;
    safePlay(sounds.genjiDead);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameOverText, canvas.width / 2, canvas.height / 2 + 50);
    ctx.font = '16px Arial';
    ctx.fillText(restartPromptText, canvas.width / 2, canvas.height / 2 + 80);

    gameRunning = false;
    cancelAnimationFrame(animationFrame);
  }
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning || isGenjiDead) return;

  const key = e.key.toLowerCase();

  if (
    !isJackVisible &&
    (key === 'q' || key === 'a' || key === 'arrowleft' || key === 'd' || key === 'arrowright')
  ) {
    return;
  }

  keyPressed[key] = true;

  if (isFreeMode && isJackVisible) {
    if (key === 'q' || key === 'a' || key === 'arrowleft') {
      genjiDirection = 'left';
      isMoving = true;
    }
    if (key === 'd' || key === 'arrowright') {
      genjiDirection = 'right';
      isMoving = true;
    }
  }

  if (key === ' ' && genji.y === 150) {
    genji.velocityY = -10;
    genji.isJumping = true;

    sounds.genjiJump.currentTime = 0;
    safePlay(sounds.genjiJump);
  }
});

document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  keyPressed[key] = false;

  if (
    isFreeMode &&
    (key === 'q' || key === 'a' || key === 'd' || key === 'arrowleft' || key === 'arrowright')
  ) {
    isMoving = false;
  }
});

restartButton.addEventListener('focus', () => {
  restartButton.blur();
});

restartButton.addEventListener('click', () => {
  restartButton.blur();

  stopAllSounds(sounds.gameRunning);
  sounds.gameRunning.currentTime = 0;
  safePlay(sounds.gameRunning);

  gameRunning = true;
  isGenjiDead = false;
  isFreeMode = false;
  isMoving = false;
  maxScoreReached = false;
  isJackVisible = false;
  isNowDieVisible = false;
  isJackGuarding = false;
  jackKilledGenji = false;
  jackAttackAnimationInProgress = false;
  jackState = 'neutral1';

  genji = { x: 50, y: 150, width: 60, height: 80, velocityY: 0, isJumping: false };
  genjiDirection = 'right';
  genjiFrameIndex = 0;
  genjiJumpFrameIndex = 0;

  jackPosition = { x: canvas.width / 2 + 50, y: canvas.height - 90 };
  jackCurrentFrameIndex = 0;
  jackGuardFrameIndex = 0;
  jackAttackFrameIndex = 0;
  jackLastFrameTime = 0;

  mercyFrameIndex = 0;

  obstacles = [];
  score = 0;
  frameCount = 0;

  clearTimeout(postGameOverTimeout);
  clearTimeout(jackNextDialogueTimeout);
  postGameOverTimeout = null;
  jackNextDialogueTimeout = null;

  cancelAnimationFrame(animationFrame);

  updateGame();
});

ctx.fillStyle = 'white';
ctx.font = '20px Arial';
ctx.fillText('Press Restart to start the game.', canvas.width / 4, canvas.height / 2);

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => reject(`Failed to load image: ${src}`);
  });
}

async function preloadImages() {
  try {
    genjiNeutral = await loadImage('assets/404/characters/genji/genji-neutral.png');
    genjiDead = await loadImage('assets/404/characters/genji/genji-dead.png');
    startScreenImage.src = 'assets/404/start-screen.png';
    jumpFrames = await Promise.all([
      loadImage('assets/404/characters/genji/genji-jump1-right.png'),
      loadImage('assets/404/characters/genji/genji-jump2-right.png'),
      loadImage('assets/404/characters/genji/genji-jump3-right.png'),
      loadImage('assets/404/characters/genji/genji-jump4-right.png'),
    ]);
    sprintFrames = await Promise.all([
      loadImage('assets/404/characters/genji/genji-sprint1-right.png'),
      loadImage('assets/404/characters/genji/genji-sprint2-right.png'),
      loadImage('assets/404/characters/genji/genji-sprint3-right.png'),
      loadImage('assets/404/characters/genji/genji-sprint4-right.png'),
      loadImage('assets/404/characters/genji/genji-sprint5-right.png'),
    ]);
    sprintFramesLeft = await Promise.all([
      loadImage('assets/404/characters/genji/genji-sprint1-left.png'),
      loadImage('assets/404/characters/genji/genji-sprint2-left.png'),
      loadImage('assets/404/characters/genji/genji-sprint3-left.png'),
      loadImage('assets/404/characters/genji/genji-sprint4-left.png'),
      loadImage('assets/404/characters/genji/genji-sprint5-left.png'),
    ]);
    mercyFrames = await Promise.all([
      loadImage('assets/404/characters/mercy/mercy-fly1.png'),
      loadImage('assets/404/characters/mercy/mercy-fly2.png'),
      loadImage('assets/404/characters/mercy/mercy-fly3.png'),
      loadImage('assets/404/characters/mercy/mercy-fly4.png'),
      loadImage('assets/404/characters/mercy/mercy-fly5.png'),
    ]);
    mercyStandFrames = await Promise.all([
      loadImage('assets/404/characters/mercy/mercy-stand1.png'),
      loadImage('assets/404/characters/mercy/mercy-stand2.png'),
      loadImage('assets/404/characters/mercy/mercy-stand3.png'),
      loadImage('assets/404/characters/mercy/mercy-stand4.png'),
      loadImage('assets/404/characters/mercy/mercy-stand5.png'),
    ]);
    jackNeutralFrames = await Promise.all([
      loadImage('assets/404/characters/jack/jack-neutral1.png'),
      loadImage('assets/404/characters/jack/jack-neutral2.png'),
      loadImage('assets/404/characters/jack/jack-neutral3.png'),
      loadImage('assets/404/characters/jack/jack-neutral4.png'),
      loadImage('assets/404/characters/jack/jack-neutral5.png'),
    ]);
    jackGuardFrames = await Promise.all([
      loadImage('assets/404/characters/jack/jack-guard1.png'),
      loadImage('assets/404/characters/jack/jack-guard2.png'),
    ]);
    jackAttackFrames = await Promise.all([
      loadImage('assets/404/characters/jack/jack-attack1.png'),
      loadImage('assets/404/characters/jack/jack-attack2.png'),
      loadImage('assets/404/characters/jack/jack-attack3.png'),
      loadImage('assets/404/characters/jack/jack-attack4.png'),
      loadImage('assets/404/characters/jack/jack-attack5.png'),
      loadImage('assets/404/characters/jack/jack-attack6.png'),
    ]);
  } catch (error) {
    console.error(error);
  }
}
preloadImages();
function showStartScreen() {
  const startPromptText = translations?.gameplay?.press_start || 'Press "Start Game" to begin!';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const imgAspect = startScreenImage.width / startScreenImage.height;
  const canvasAspect = canvas.width / canvas.height;

  let sourceX = 0,
    sourceY = 0;
  let sourceWidth = startScreenImage.width,
    sourceHeight = startScreenImage.height;

  if (imgAspect > canvasAspect) {
    sourceWidth = startScreenImage.height * canvasAspect;
    sourceX = (startScreenImage.width - sourceWidth) / 2;
  } else {
    sourceHeight = startScreenImage.width / canvasAspect;
    sourceY = (startScreenImage.height - sourceHeight) / 2 - 120;
  }

  ctx.drawImage(
    startScreenImage,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.font = 'bold 20px Arial';
  const textWidth = ctx.measureText(startPromptText).width;
  const textHeight = 30;
  const rectPadding = 20;

  const rectX = canvas.width / 2 - textWidth / 2 - rectPadding;
  const rectY = canvas.height - 80;
  const rectWidth = textWidth + rectPadding * 2;
  const rectHeight = textHeight + rectPadding;

  ctx.fillStyle = '#2b2b2b';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rectX, rectY, rectWidth, rectHeight, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(startPromptText, canvas.width / 2, rectY + rectHeight / 2 + 5);
}

function startGame() {
  gameRunning = true;
  updateGame();
}

// Volume
const volumeSlider = document.getElementById('volumeRange');

function updateGameVolume(level) {
  const v = Math.max(0, Math.min(100, Number(level))) / 100;
  Object.values(sounds).forEach((a) => {
    a.volume = v;
  });
  localStorage.setItem('gp_game_volume', String(Math.round(v * 100)));
}

if (volumeSlider) {
  const saved = Number(localStorage.getItem('gp_game_volume') ?? 70);
  volumeSlider.value = String(saved);
  updateGameVolume(saved);

  volumeSlider.addEventListener('input', (e) => updateGameVolume(e.target.value));
  volumeSlider.addEventListener('change', (e) => updateGameVolume(e.target.value));
}
