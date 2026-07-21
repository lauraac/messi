"use strict";

/* =========================
   CONFETI
========================= */

const particlesContainer = document.getElementById("particles");

const confettiColors = [
  "#ffffff",
  "#00a2ff",
  "#59d3ff",
  "#00d26a",
  "#d5f4ff",
  "#ffd700",
];

let confettiTimeout = null;

function createConfetti() {
  if (!particlesContainer) {
    return;
  }

  /*
    Limpia el confeti anterior para que
    no se acumulen demasiados elementos.
  */
  particlesContainer.innerHTML = "";

  window.clearTimeout(confettiTimeout);

  const totalPieces = window.innerWidth <= 480 ? 65 : 100;

  for (let index = 0; index < totalPieces; index += 1) {
    const piece = document.createElement("span");

    piece.className = "confeti";

    piece.style.left = `${Math.random() * 100}%`;

    piece.style.backgroundColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];

    piece.style.animationDuration = `${3 + Math.random() * 4}s`;

    piece.style.animationDelay = `${Math.random() * 1.8}s`;

    piece.style.width = `${6 + Math.random() * 5}px`;

    piece.style.height = `${10 + Math.random() * 8}px`;

    /*
      Algunos confetis serán redondos
      y otros rectangulares.
    */
    if (Math.random() > 0.55) {
      piece.style.borderRadius = "50%";
    }

    particlesContainer.appendChild(piece);
  }

  /*
    Elimina los elementos cuando ya
    terminaron de caer.
  */
  confettiTimeout = window.setTimeout(() => {
    particlesContainer.innerHTML = "";
  }, 9500);
}

/* =========================
   CONTROL DE MÚSICA
========================= */

const music = document.getElementById("backgroundMusic");

const musicButton = document.getElementById("musicButton");

const musicLabel = document.getElementById("musicLabel");

const musicStatusIcon = document.getElementById("musicStatusIcon");

let isPlaying = false;
let fadeInterval = null;
let automaticStartPending = true;

const initialVolume = 0.01;
const finalVolume = 0.55;

/* =========================
   ESTADO DEL BOTÓN
========================= */

function updateMusicButton() {
  if (!musicButton || !musicLabel || !musicStatusIcon) {
    return;
  }

  musicButton.setAttribute("aria-pressed", String(isPlaying));

  musicButton.setAttribute(
    "aria-label",
    isPlaying ? "Pausar música" : "Reproducir música",
  );

  musicStatusIcon.textContent = isPlaying ? "Ⅱ" : "▶";

  musicLabel.textContent = isPlaying ? "Pausar" : "Música";

  musicButton.classList.toggle("is-playing", isPlaying);
}

/* =========================
   AUMENTAR VOLUMEN
========================= */

function fadeInMusic() {
  if (!music) {
    return;
  }

  window.clearInterval(fadeInterval);

  music.volume = initialVolume;

  fadeInterval = window.setInterval(() => {
    const nextVolume = music.volume + 0.015;

    if (nextVolume >= finalVolume) {
      music.volume = finalVolume;

      window.clearInterval(fadeInterval);
      fadeInterval = null;

      return;
    }

    music.volume = nextVolume;
  }, 100);
}

/* =========================
   BAJAR VOLUMEN Y PAUSAR
========================= */

function fadeOutAndPause() {
  if (!music) {
    return;
  }

  window.clearInterval(fadeInterval);

  fadeInterval = window.setInterval(() => {
    const nextVolume = music.volume - 0.04;

    if (nextVolume <= initialVolume) {
      music.volume = initialVolume;
      music.pause();

      window.clearInterval(fadeInterval);
      fadeInterval = null;

      isPlaying = false;

      updateMusicButton();

      return;
    }

    music.volume = nextVolume;
  }, 60);
}

/* =========================
   INICIAR MÚSICA
========================= */

async function startMusic() {
  if (!music) {
    return;
  }

  if (!music.paused) {
    return;
  }

  try {
    window.clearInterval(fadeInterval);

    music.volume = initialVolume;

    await music.play();

    isPlaying = true;
    automaticStartPending = false;

    updateMusicButton();
    fadeInMusic();
  } catch (error) {
    /*
      Chrome, Safari y los navegadores internos
      de WhatsApp pueden bloquear el autoplay.
    */

    automaticStartPending = true;
    isPlaying = false;

    updateMusicButton();

    console.log("La música comenzará cuando la persona toque la pantalla.");
  }
}

/* =========================
   BOTÓN DE MÚSICA
========================= */

function toggleMusic(event) {
  if (event) {
    event.stopPropagation();
  }

  if (!music) {
    return;
  }

  if (music.paused) {
    startMusic();
  } else {
    fadeOutAndPause();
  }
}

if (musicButton) {
  musicButton.addEventListener("click", toggleMusic);
}

/* =========================
   PRIMER TOQUE EN PANTALLA
========================= */

async function startMusicOnFirstInteraction(event) {
  if (!music) {
    return;
  }

  /*
    Si el toque fue directamente en el botón,
    dejamos que toggleMusic lo controle.
  */
  if (event.target.closest && event.target.closest("#musicButton")) {
    return;
  }

  if (automaticStartPending && music.paused) {
    await startMusic();
  }
}

document.addEventListener("pointerdown", startMusicOnFirstInteraction, {
  once: true,
});

/* Compatibilidad con algunos dispositivos */

document.addEventListener("touchstart", startMusicOnFirstInteraction, {
  once: true,
  passive: true,
});

/* =========================
   EVENTOS DEL AUDIO
========================= */

if (music) {
  music.addEventListener("play", () => {
    isPlaying = true;

    updateMusicButton();
  });

  music.addEventListener("pause", () => {
    isPlaying = false;

    updateMusicButton();
  });

  music.addEventListener("ended", () => {
    isPlaying = false;

    updateMusicButton();
  });

  music.addEventListener("error", () => {
    isPlaying = false;

    updateMusicButton();

    console.warn("No se pudo cargar el archivo img/messi.mp3.");
  });
}

/* =========================
   INICIO
========================= */

window.addEventListener("load", () => {
  createConfetti();
  updateMusicButton();

  /*
    Intenta iniciar automáticamente.
    Si el navegador lo bloquea, iniciará
    con el primer toque en pantalla.
  */
  startMusic();
});

/* =========================
   REPETIR CONFETI
========================= */

window.setInterval(() => {
  createConfetti();
}, 14000);
