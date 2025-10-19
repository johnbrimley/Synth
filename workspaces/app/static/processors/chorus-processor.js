class i {
  buffer;
  index = 0;
  constructor(e) {
    this.buffer = new Float32Array(e);
  }
  pushPop(e) {
    const t = this.buffer[this.index];
    return this.buffer[this.index] = e, this.index = (this.index + 1) % this.buffer.length, t;
  }
}
class d extends AudioWorkletProcessor {
  delay = 0;
  delayBuffers = null;
  constructor() {
    super(), this.port.onmessage = (e) => {
      const t = e.data;
      switch (t.type) {
        case "setDelay":
          Math.round(sampleRate / 1e3 * t.delayInMilliseconds), this.delay = t.delayInMilliseconds, this.delayBuffers = null;
          break;
      }
    };
  }
  process(e, t) {
    if (this.delayBuffers === null && (this.delayBuffers = e.map(
      (s) => s.map(() => new i(this.delay))
    )), this.delay == 0)
      return this.passthrough(e, t), !0;
    for (let s = 0; s < e.length; s++) {
      this.delayBuffers[s];
      const o = e[s];
      for (let n = 0; n < o.length; n++) {
        const l = o[n], h = t[s][n], r = this.delayBuffers[s][n];
        for (let a = 0; a < l.length; a++) {
          const f = r.pushPop(l[a]);
          h[a] = l[a] + f;
        }
      }
    }
    return !0;
  }
  passthrough(e, t) {
    for (let s = 0; s < e.length; s++) {
      const o = e[s];
      for (let n = 0; n < o.length; n++) {
        const l = o[n], h = t[s][n];
        for (let r = 0; r < l.length; r++)
          h[r] = l[r];
      }
    }
  }
}
registerProcessor("chorus-processor", d);
