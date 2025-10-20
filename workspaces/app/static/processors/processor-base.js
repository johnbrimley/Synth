class a extends AudioWorkletProcessor {
  //The size of the render quantum for the AudioWorkletProcessor is 128 sample-frames and cannot be changed.
  static EMPTY_BUFFER = new Float32Array(128);
  sampleIndex = 0;
  port;
  constructor() {
    super(), this.port = super.port;
  }
  process(s, r) {
    for (let e = 0; e < r.length; e++) {
      const o = r[e], p = s[e];
      for (let n = 0; n < o.length; n++) {
        const u = p[n] ?? a.EMPTY_BUFFER, l = o[n];
        for (let t = 0; t < l.length; t++)
          this.sampleIndex = currentFrame + t, l[t] = this.processSample(u[t]);
      }
    }
    return !0;
  }
  static passthrough(s, r) {
    for (let e = 0; e < r.length; e++) {
      const o = r[e], p = s[e];
      for (let n = 0; n < o.length; n++) {
        const u = p[n] ?? a.EMPTY_BUFFER, l = o[n];
        for (let t = 0; t < l.length; t++)
          l[t] = u[t];
      }
    }
    return !0;
  }
}
export {
  a as P
};
