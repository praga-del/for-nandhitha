const music = document.getElementById('music');
const musicControl = document.getElementById('musicControl');
const openButton = document.getElementById('openSurprise');
const replayButton = document.getElementById('replay');
const scenes = [...document.querySelectorAll('.scene')];
const nextButtons = [...document.querySelectorAll('.next-btn')];
const touchScene = document.getElementById('touch');
const touchFrame = document.querySelector('.touch-frame');
const touchCueSeconds = 79;
const lockScreen = document.getElementById('lockScreen');
const passcodeDisplay = document.getElementById('passcodeDisplay');
const unlockButton = document.getElementById('unlockButton');
const lockError = document.getElementById('lockError');
const keypadBtns = [...document.querySelectorAll('.keypad-btn[data-value]')];
const keypadClear = document.getElementById('keypadClear');
const keypadDelete = document.getElementById('keypadDelete');

let passcodeValue = '';
let musicOn = false;
let touchCueTriggered = false;
let currentSceneIndex = 0;

// Passcode display animation
function animatePasscodeDisplay(type = 'input') {
  passcodeDisplay.classList.remove('shake', 'success');
  if (type === 'shake') {
    passcodeDisplay.offsetHeight; // Trigger reflow
    passcodeDisplay.classList.add('shake');
  } else if (type === 'success') {
    passcodeDisplay.offsetHeight; // Trigger reflow
    passcodeDisplay.classList.add('success');
  }
}

// Keypad functionality
function updatePasscodeDisplay() {
  passcodeDisplay.textContent = '•'.repeat(passcodeValue.length).padEnd(4, '•');
  animatePasscodeDisplay('input');
}

keypadBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (passcodeValue.length < 4) {
      passcodeValue += btn.dataset.value;
      updatePasscodeDisplay();
      if (passcodeValue.length === 4) {
        checkPasscode();
      }
    }
  });
});

keypadDelete.addEventListener('click', () => {
  if (passcodeValue.length > 0) {
    passcodeValue = passcodeValue.slice(0, -1);
    updatePasscodeDisplay();
    lockError.classList.remove('show');
  }
});

keypadClear.addEventListener('click', () => {
  passcodeValue = '';
  updatePasscodeDisplay();
  lockError.classList.remove('show');
});

unlockButton.addEventListener('click', () => {
  if (passcodeValue.length === 4) {
    checkPasscode();
  }
});

function checkPasscode() {
  if (passcodeValue === '3733') {
    animatePasscodeDisplay('success');
    setTimeout(() => {
      lockScreen.classList.add('unlocked');
      startMusic(); // Start music immediately on correct passcode
      showScene(0);
    }, 600);
  } else {
    animatePasscodeDisplay('shake');
    lockError.classList.add('show');
    setTimeout(() => {
      passcodeValue = '';
      updatePasscodeDisplay();
      lockError.classList.remove('show');
    }, 600);
  }
}

// Music functionality
function startMusic() {
  music.play().then(() => {
    musicOn = true;
    musicControl.querySelector('span').textContent = 'music on';
  }).catch(() => {
    musicControl.querySelector('span').textContent = 'tap for music';
  });
}

// Wizard scene management with transitions
function showScene(index) {
  scenes.forEach((scene) => scene.classList.remove('active'));
  if (index >= 0 && index < scenes.length) {
    scenes[index].classList.add('active');
    currentSceneIndex = index;
  }
}

function nextScene() {
  if (currentSceneIndex < scenes.length - 1) {
    showScene(currentSceneIndex + 1);
  }
}

function prevScene() {
  if (currentSceneIndex > 0) {
    showScene(currentSceneIndex - 1);
  }
}

// Open surprise button
openButton.addEventListener('click', () => {
  nextScene();
  burstHearts(9);
});

// Next buttons
nextButtons.forEach((button) => {
  button.addEventListener('click', () => {
    nextScene();
    burstHearts(5);
  });
});

// Music control
musicControl.addEventListener('click', () => {
  if (music.paused) {
    startMusic();
  } else {
    music.pause();
    musicOn = false;
    musicControl.querySelector('span').textContent = 'music off';
  }
});

// Music cue for touch scene
music.addEventListener('timeupdate', () => {
  if (!touchCueTriggered && music.currentTime >= touchCueSeconds) {
    touchCueTriggered = true;
    touchScene.classList.add('cue-active');
    touchFrame.classList.add('touch-arrived');
    
    // Trigger sophisticated animations
    const childhoodPhoto = touchScene.querySelector('.childhood-photo');
    const lipsPhoto = touchScene.querySelector('.lips-photo');
    const touchGlow = touchScene.querySelector('.touch-glow');
    const touchHearts = touchScene.querySelector('.touch-hearts');
    
    if (childhoodPhoto) childhoodPhoto.classList.add('zoom-active');
    if (lipsPhoto) lipsPhoto.classList.add('fade-active');
    if (touchGlow) touchGlow.classList.add('glow-active');
    
    // Create floating hearts at touch point
    if (touchHearts) {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const heart = document.createElement('span');
          heart.className = 'floating-heart';
          heart.textContent = '♡';
          heart.style.position = 'absolute';
          heart.style.fontSize = (8 + Math.random() * 12) + 'px';
          heart.style.color = 'var(--rose)';
          heart.style.opacity = '1';
          heart.style.animation = `floatingHeart ${1.2 + Math.random() * 0.8}s ease-out forwards`;
          heart.style.left = (Math.random() * 40 - 20) + 'px';
          heart.style.top = (Math.random() * 40 - 20) + 'px';
          touchHearts.appendChild(heart);
          setTimeout(() => heart.remove(), 2000);
        }, i * 150);
      }
    }
    
    showScene(scenes.indexOf(touchScene));
    burstHearts(16);
  }
});

// Replay
replayButton.addEventListener('click', () => {
  music.currentTime = 0;
  touchCueTriggered = false;
  touchScene.classList.remove('cue-active');
  touchFrame.classList.remove('touch-arrived');
  
  // Reset animations
  const childhoodPhoto = touchScene.querySelector('.childhood-photo');
  const lipsPhoto = touchScene.querySelector('.lips-photo');
  const touchGlow = touchScene.querySelector('.touch-glow');
  const touchHearts = touchScene.querySelector('.touch-hearts');
  
  if (childhoodPhoto) childhoodPhoto.classList.remove('zoom-active');
  if (lipsPhoto) lipsPhoto.classList.remove('fade-active');
  if (touchGlow) touchGlow.classList.remove('glow-active');
  if (touchHearts) touchHearts.innerHTML = '';
  
  showScene(0);
  burstHearts(5);
});

// Intersection observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      if (entry.target.id === 'final') burstHearts(12);
    }
  });
}, { threshold: 0.35 });

scenes.forEach((scene) => observer.observe(scene));

// Click for hearts
document.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button') || event.target.closest('.music-control')) return;
  if (Math.random() > 0.72) createHeart(event.clientX, event.clientY);
});

function createHeart(x = Math.random() * window.innerWidth, y = window.innerHeight + 20) {
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = Math.random() > 0.45 ? '♡' : '✦';
  heart.style.left = `${x}px`;
  heart.style.bottom = `${Math.max(0, window.innerHeight - y)}px`;
  heart.style.fontSize = `${12 + Math.random() * 18}px`;
  heart.style.animationDuration = `${5 + Math.random() * 4}s`;
  document.getElementById('hearts').appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

function burstHearts(amount) {
  for (let index = 0; index < amount; index += 1) {
    setTimeout(() => createHeart(Math.random() * window.innerWidth, window.innerHeight + 20), index * 180);
  }
}
