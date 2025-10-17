export {}

const audioContext = new AudioContext();
console.log(audioContext.sampleRate);
await audioContext.audioWorklet.addModule('tone-processor.js');
await audioContext.audioWorklet.addModule('chorus-processor.js');
await audioContext.audioWorklet.addModule('hyperbolic-tangent-processor.js');
const toneNode = new AudioWorkletNode(
  audioContext,
  'tone-processor'
);
const chorusNode = new AudioWorkletNode(
  audioContext,
  'chorus-processor'
);
const hyperbolicTangentNode = new AudioWorkletNode(
  audioContext,
  'hyperbolic-tangent-processor'
);
toneNode
.connect(chorusNode)
.connect(hyperbolicTangentNode)
.connect(audioContext.destination);

const waveformSelect = document.getElementById('waveform') as HTMLSelectElement;

// Listen for when the user changes the selected option
waveformSelect.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedValue = target.value;
  // Example: send to your AudioWorklet
  toneNode.port.postMessage({ type: 'setWaveform', waveform: selectedValue });
});

const chorusDelay = document.getElementById('chorusDelaySlider') as HTMLInputElement;

// Listen for when the user changes the selected option
chorusDelay.addEventListener('change', (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedValue = target.value;
  const text = document.getElementById('chorusDelayText') as HTMLInputElement;
  text.value = selectedValue + 'ms';
  // Example: send to your AudioWorklet
  chorusNode.port.postMessage({ type: 'setDelay', delayInMilliseconds: selectedValue });
});

function noteOn(frequency: number) {
  toneNode.port.postMessage({ type: 'noteOn', frequency });
}

function noteOff(frequency: number) {
  toneNode.port.postMessage({ type: 'noteOff', frequency });
}

// key mappings
const noteMap: Record<string, number> = {
  a: 261.63, // C4
  w: 277.18, // C#4 / Db4
  s: 293.66, // D4
  e: 311.13, // D#4 / Eb4
  d: 329.63, // E4
  f: 349.23, // F4
  t: 369.99, // F#4 / Gb4
  g: 392.00, // G4
  y: 415.30, // G#4 / Ab4
  h: 440.00, // A4
  u: 466.16, // A#4 / Bb4
  j: 493.88, // B4
  k: 523.25, // B4
};

window.addEventListener('keydown', (event: KeyboardEvent) => {
  const freq = noteMap[event.key];
  if (freq) noteOn(freq);
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
  const freq = noteMap[event.key];
  if (freq) noteOff(freq);
});