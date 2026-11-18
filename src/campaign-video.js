import { reducedMotion } from "./motion.js";

let apiPromise;
function loadAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("YouTube did not load")),
      12000,
    );
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("YouTube unavailable"));
    };
    document.head.append(script);
  }).catch((error) => {
    apiPromise = null;
    throw error;
  });
  return apiPromise;
}

export function campaignVideo() {
  const host = document.getElementById("campaign-video");
  const backdrop = host.parentElement;
  const button = document.getElementById("video-toggle");
  const status = document.getElementById("video-status");
  const link = document.getElementById("video-link");
  let player,
    videoId,
    active = false,
    paused = reducedMotion.matches,
    generation = 0,
    ready = false,
    playing = false,
    disposed = false;
  let playbackTimeout;
  function report(message = "") {
    status.textContent = message;
  }
  function label() {
    button.textContent = paused ? "Play video" : "Pause video";
  }
  function watchPlayback() {
    clearTimeout(playbackTimeout);
    playbackTimeout = setTimeout(() => {
      if (!playing && active && !paused)
        report("Video unavailable or blocked. Watch on YouTube.");
    }, 12000);
  }
  async function start() {
    if (!active || paused || document.hidden || disposed) return;
    const request = ++generation;
    label();
    try {
      const YT = await loadAPI();
      if (request !== generation || !active || paused || disposed) return;
      if (player) {
        if (ready) {
          player.mute();
          player.playVideo();
          watchPlayback();
        }
        return;
      }
      report("Loading campaign video…");
      const mount = document.createElement("div");
      host.replaceChildren(mount);
      player = new YT.Player(mount, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          loop: 1,
          playlist: videoId,
          origin: location.origin,
        },
        events: {
          onReady(event) {
            ready = true;
            const iframe = event.target.getIframe();
            iframe.tabIndex = -1;
            iframe.title = "Campaign video";
            event.target.mute();
            if (active && !paused && !document.hidden) {
              event.target.playVideo();
              watchPlayback();
            } else event.target.pauseVideo();
          },
          onStateChange(event) {
            playing = event.data === 1;
            backdrop.classList.toggle("is-playing", playing);
            if (playing) {
              report();
              clearTimeout(playbackTimeout);
            }
            if (event.data === 0 && active && !paused) {
              player.seekTo(0);
              player.playVideo();
            }
          },
          onError() {
            report("This video cannot play here. Watch on YouTube.");
            backdrop.classList.remove("is-playing");
          },
        },
      });
      watchPlayback();
    } catch {
      if (!disposed && request === generation)
        report("Video unavailable. Watch on YouTube.");
    }
  }
  function stop() {
    generation++;
    clearTimeout(playbackTimeout);
    if (ready) player.pauseVideo();
    playing = false;
    backdrop.classList.remove("is-playing");
  }
  function setVideo(id) {
    if (id === videoId) return;
    stop();
    player?.destroy();
    player = undefined;
    ready = false;
    videoId = id;
    link.href = "https://www.youtube.com/watch?v=" + id;
    backdrop.style.backgroundImage =
      'url("https://i.ytimg.com/vi/' + id + '/hqdefault.jpg")';
    report();
    start();
  }
  button.addEventListener("click", () => {
    paused = !paused;
    label();
    if (paused) {
      stop();
      report("Video paused.");
    } else start();
  });
  function visibility() {
    if (document.hidden) stop();
    else start();
  }
  function preference() {
    paused = reducedMotion.matches;
    label();
    if (paused) {
      stop();
      report("Video paused for reduced motion.");
    } else start();
  }
  document.addEventListener("visibilitychange", visibility);
  reducedMotion.addEventListener("change", preference);
  label();
  return {
    setVideo,
    setActive(value) {
      active = value;
      if (value) start();
      else stop();
    },
    dispose() {
      disposed = true;
      stop();
      player?.destroy();
      document.removeEventListener("visibilitychange", visibility);
      reducedMotion.removeEventListener("change", preference);
    },
  };
}
