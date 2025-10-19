class l extends AudioWorkletProcessor {
  //The size of the render quantum for the AudioWorkletProcessor is 128 sample-frames and cannot be changed.
  static EMPTY_BUFFER = new Float32Array(128);
  sampleIndex = 0;
  port;
  constructor() {
    super(), this.port = super.port;
  }
  process(p, r) {
    for (let t = 0; t < r.length; t++) {
      const o = r[t], a = p[t];
      for (let n = 0; n < o.length; n++) {
        const c = a[n] ?? l.EMPTY_BUFFER, s = o[n];
        for (let e = 0; e < s.length; e++)
          this.sampleIndex = currentFrame + e, s[e] = this.processSample(c[e]);
      }
    }
    return !0;
  }
}
export {
  l as P
};
