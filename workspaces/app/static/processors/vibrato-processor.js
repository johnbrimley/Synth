import { W as m, a as o, O as l } from "./waveform-generator.js";
import { C as u } from "./convert.js";
import { P as g } from "./processor-base.js";
class b {
  buffer;
  baseDelay;
  writeIndex = 0;
  constructor(t, s) {
    if (this.baseDelay = s ?? t, this.baseDelay < t)
      throw new Error("baseDelay must be >= sampleDepth");
    this.buffer = new Float32Array(this.baseDelay + t);
  }
  push(t) {
    this.buffer[this.writeIndex++] = t, this.writeIndex === this.buffer.length && (this.writeIndex = 0);
  }
  readOffset(t) {
    let s = this.writeIndex - this.baseDelay + t;
    s = (s % this.buffer.length + this.buffer.length) % this.buffer.length;
    const e = Math.floor(s), n = (e + 1) % this.buffer.length, i = s - e;
    return this.buffer[e] * (1 - i) + this.buffer[n] * i;
  }
}
class y extends AudioWorkletProcessor {
  settings = {
    active: !1,
    frequency: 0,
    waveform: m.Sine,
    depth: 0
  };
  generator = new o(this.settings.waveform, new l(sampleRate, this.settings.frequency));
  sampleDepth = u.toSamples(sampleRate, this.settings.depth);
  delayBuffers = [];
  constructor() {
    super(), this.port.onmessage = (t) => {
      this.settings = t.data, this.generator = new o(this.settings.waveform, new l(sampleRate, this.settings.frequency)), this.sampleDepth = u.toSamples(sampleRate, this.settings.depth), this.delayBuffers = [];
    };
  }
  process(t, s) {
    if (!this.settings.active)
      return g.passthrough(t, s);
    for (let e = 0; e < s.length; e++) {
      const n = s[e], i = t[e];
      this.delayBuffers[e] || (this.delayBuffers[e] = []);
      for (let r = 0; r < n.length; r++) {
        const p = i[r], f = n[r];
        this.delayBuffers[e][r] || (this.delayBuffers[e][r] = new b(this.sampleDepth));
        const h = this.delayBuffers[e][r];
        for (let a = 0; a < f.length; a++) {
          const d = this.generator.sampleAt(currentFrame + a) * this.sampleDepth;
          f[a] = h.readOffset(d), h.push(p[a]);
        }
      }
    }
    return !0;
  }
}
registerProcessor("vibrato-processor", y);
