// 🔥 SSR-safe singletons
let audio: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;

// runs only in browser
export function initAudioEngine() {
  if (typeof window === "undefined") return null;

  // create audio element ONCE
  if (!audio) {
    audio = document.createElement("audio");
    audio.setAttribute("data-global-player", "true");
    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    document.body.appendChild(audio);
  }

  // create audio context ONCE
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  // create source node ONCE
  if (!sourceNode) {
    sourceNode = audioCtx.createMediaElementSource(audio);
  }

  // create analyser ONCE
  if (!analyser) {
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  return { audio, audioCtx, analyser };
}
