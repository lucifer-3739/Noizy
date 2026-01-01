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

  // AudioContext and nodes are now created/resumed on user gesture
  return { audio, audioCtx, analyser };
}

// Call this in a user gesture handler (e.g. play button)
export async function resumeAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
  // create source node ONCE
  if (!sourceNode && audio) {
    sourceNode = audioCtx.createMediaElementSource(audio);
  }
  // create analyser ONCE
  if (!analyser && audioCtx) {
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode?.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  return { audio, audioCtx, analyser };
}
