(() => {
  const audio = document.querySelector("#love-song");
  const lyrics = document.querySelector("#lyrics");
  const repeatButton = document.querySelector("#repeat-btn");

  if (!audio || !lyrics) {
    return;
  }

  // Tiempos ajustados a la grabación de 2:34 incluida en el proyecto.
  // Cada línea permanece visible hasta el inicio de la siguiente entrada.
  const lyricsData = [
    { start: 6.56, end: 12.75, text: "L — is for the way you look at me" },
    { start: 12.75, end: 18.45, text: "O — is for the only one I see" },
    { start: 18.45, end: 26.0, text: "V — is very, very extraordinary" },
    { start: 26.0, end: 31.66, text: "E — is even more than anyone that you adore can" },
    { start: 31.66, end: 37.7, text: "Love is all that I can give to you" },
    { start: 37.7, end: 43.79, text: "Love is more than just a game for two" },
    { start: 43.79, end: 47.56, text: "Two in love can make it" },
    { start: 47.56, end: 50.68, text: "Take my heart and please don't break it" },
    { start: 50.68, end: 69.83, text: "Love was made for me and you" },
    { start: 81.87, end: 87.92, text: "L — is for the way you look at me" },
    { start: 87.92, end: 93.72, text: "O — is for the only one I see" },
    { start: 93.72, end: 100.07, text: "V — is very, very extraordinary" },
    { start: 100.07, end: 106.66, text: "E — is even more than anyone that you adore can" },
    { start: 106.66, end: 112.04, text: "Love is all that I can give to you" },
    { start: 112.04, end: 118.06, text: "Love is more than just a game for two" },
    { start: 118.06, end: 121.61, text: "Two in love can make it" },
    { start: 121.61, end: 124.56, text: "Take my heart and please don't break it" },
    { start: 124.56, end: 129.98, text: "Love was made for me and you" },
    { start: 129.98, end: 136.06, text: "Love was made for me and you" },
    { start: 136.06, end: 147.65, text: "Love was made for me and you" },
  ];

  let currentLyricIndex = -1;
  let animationFrameId = null;

  function findCurrentLyricIndex(currentTime) {
    return lyricsData.findIndex(
      ({ start, end }) => currentTime >= start && currentTime < end,
    );
  }

  function hideLyrics() {
    lyrics.classList.remove("lyric-visible");
    lyrics.textContent = "";
  }

  function showLyrics(text) {
    lyrics.classList.remove("lyric-visible");
    lyrics.textContent = text;

    // Reinicia la animación cuando cambia la frase.
    void lyrics.offsetWidth;
    lyrics.classList.add("lyric-visible");
  }

  function updateLyrics({ force = false } = {}) {
    const nextIndex = findCurrentLyricIndex(audio.currentTime);

    if (!force && nextIndex === currentLyricIndex) {
      return;
    }

    currentLyricIndex = nextIndex;

    if (nextIndex === -1) {
      hideLyrics();
      return;
    }

    showLyrics(lyricsData[nextIndex].text);
  }

  function stopSyncLoop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function syncLoop() {
    updateLyrics();

    if (!audio.paused && !audio.ended) {
      animationFrameId = requestAnimationFrame(syncLoop);
    } else {
      animationFrameId = null;
    }
  }

  function startSyncLoop() {
    stopSyncLoop();
    updateLyrics({ force: true });
    animationFrameId = requestAnimationFrame(syncLoop);
  }

  audio.addEventListener("play", startSyncLoop);
  audio.addEventListener("seeked", () => updateLyrics({ force: true }));
  audio.addEventListener("loadedmetadata", () => updateLyrics({ force: true }));
  audio.addEventListener("pause", stopSyncLoop);
  audio.addEventListener("ended", () => {
    stopSyncLoop();
    currentLyricIndex = -1;
    hideLyrics();
  });

  if (repeatButton) {
    repeatButton.addEventListener("click", async () => {
      stopSyncLoop();
      audio.currentTime = 0;
      currentLyricIndex = -1;
      hideLyrics();

      try {
        await audio.play();
        startSyncLoop();
      } catch (error) {
        console.warn("No se pudo iniciar la canción:", error);
      }
    });
  }

  if (audio.paused) {
    updateLyrics({ force: true });
  } else {
    startSyncLoop();
  }
})();
