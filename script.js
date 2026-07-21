"use strict";

/* =========================
   CONFETI
========================= */

const particlesContainer = document.getElementById("particles");

const confettiColors = ["#ffffff", "#00a2ff", "#59d3ff", "#00d26a", "#d5f4ff"];

function createConfetti() {
  const totalPieces = window.innerWidth <= 480 ? 55 : 90;

  for (let index = 0; index < totalPieces; index += 1) {
    const piece = document.createElement("span");

    piece.className = "confeti";

    piece.style.left = `${Math.random() * 100}%`;

    piece.style.backgroundColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];

    piece.style.animationDuration = `${2.5 + Math.random() * 3.5}s`;

    piece.style.animationDelay = `${Math.random() * 1.5}s`;

    if (Math.random() > 0.5) {
      piece.style.borderRadius = "50%";
    }

    particlesContainer.appendChild(piece);
  }

  /* Elimina el confeti para evitar consumo innecesario */
  window.setTimeout(() => {
    particlesContainer.innerHTML = "";
  }, 7500);
}

/* =========================
   CONTROL DE MÚSICA
========================= */

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const musicLabel = document.getElementById("musicLabel");

let isPlaying = false;

function updateMusicButton() {
  musicButton.setAttribute("aria-pressed", String(isPlaying));

  musicButton.setAttribute(
    "aria-label",
    isPlaying ? "Pausar música" : "Reproducir música",
  );

  musicIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  musicLabel.textContent = isPlaying ? "Pausar" : "Música";

  musicButton.classList.toggle("is-playing", isPlaying);
}

async function toggleMusic() {
  try {
    if (music.paused) {
      await music.play();
      isPlaying = true;
    } else {
      music.pause();
      isPlaying = false;
    }

    updateMusicButton();
  } catch (error) {
    console.warn(
      "El navegador requiere que la persona toque el botón para iniciar la música.",
      error,
    );

    isPlaying = false;
    updateMusicButton();
  }
}

musicButton.addEventListener("click", toggleMusic);

music.addEventListener("ended", () => {
  isPlaying = false;
  updateMusicButton();
});

music.addEventListener("pause", () => {
  isPlaying = false;
  updateMusicButton();
});

music.addEventListener("play", () => {
  isPlaying = true;
  updateMusicButton();
});

/* =========================
   INICIO
========================= */

window.addEventListener("load", () => {
  createConfetti();
  updateMusicButton();
});
