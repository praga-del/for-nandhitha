const music = document.getElementById('music');
const musicControl = document.getElementById('musicControl');
const openButton = document.getElementById('openSurprise');
const replayButton = document.getElementById('replay');
const scenes = [...document.querySelectorAll('.scene')];
const nextButtons = [...document.querySelectorAll('.next-btn')];
let musicOn = false;

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

replayButton.addEventListener('click', () => {
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
