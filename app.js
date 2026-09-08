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
const passcodeInput = document.getElementById('passcode');
const unlockButton = document.getElementById('unlockButton');
const lockError = document.getElementById('lockError');
let musicOn = false;
let touchCueTriggered = false;

function unlock() {
  if (passcodeInput.value === '3733') {
    lockScreen.classList.add('unlocked');
    passcodeInput.blur();
  } else {
    lockError.classList.add('show');
    passcodeInput.value = '';
  }
}

unlockButton.addEventListener('click', unlock);
passcodeInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') unlock();
});

function startMusic() {
  music.play().then(() => {
    musicOn = true;
    musicControl.querySelector('span').textContent = 'music on';
  }).catch(() => {
    musicControl.querySelector('span').textContent = 'tap for music';
  });
}

function scrollToScene(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

openButton.addEventListener('click', () => {
  startMusic();
  scrollToScene('welcome');
  burstHearts(9);
});

nextButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const current = button.closest('.scene');
    const next = current?.nextElementSibling;
    if (next?.classList.contains('scene')) scrollToScene(next.id);
  });
});

musicControl.addEventListener('click', () => {
  if (music.paused) {
    startMusic();
  } else {
    music.pause();
    musicOn = false;
    musicControl.querySelector('span').textContent = 'music off';
  }
});

music.addEventListener('timeupdate', () => {
  if (!touchCueTriggered && music.currentTime >= touchCueSeconds) {
    touchCueTriggered = true;
    touchScene.classList.add('cue-active');
    touchFrame.classList.add('touch-arrived');
    scrollToScene('touch');
    burstHearts(16);
  }
});

replayButton.addEventListener('click', () => {
  music.currentTime = 0;
  touchCueTriggered = false;
  touchScene.classList.remove('cue-active');
  touchFrame.classList.remove('touch-arrived');
  scrollToScene('opening');
  burstHearts(5);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      if (entry.target.id === 'final') burstHearts(12);
    }
  });
}, { threshold: 0.35 });

scenes.forEach((scene) => observer.observe(scene));

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
