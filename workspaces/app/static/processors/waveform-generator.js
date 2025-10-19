var a = /* @__PURE__ */ ((t) => (t.Sine = "Sine", t.Square = "Square", t.Saw = "Saw", t.Triangle = "Triangle", t))(a || {});
class n {
  phaseIncrement;
  constructor(e, r) {
    this.phaseIncrement = r / e;
  }
  phaseAt(e) {
    return e * this.phaseIncrement % 1;
  }
}
class s {
  constructor(e, r) {
    this.waveform = e, this.oscillator = r, this.waveformFunction = this.createWaveformFunction(e);
  }
  waveformFunction;
  createWaveformFunction(e) {
    switch (e) {
      case a.Sine:
        return (r) => Math.sin(2 * Math.PI * r);
      case a.Square:
        return (r) => r < 0.5 ? 1 : -1;
      case a.Saw:
        return (r) => 2 * r - 1;
      case a.Triangle:
        return (r) => 4 * Math.abs(r - 0.5) - 1;
      default:
        throw new Error(`Unsupported waveform: ${e}`);
    }
  }
  sampleAt(e) {
    return this.waveformFunction(this.oscillator.phaseAt(e));
  }
}
export {
  n as O,
  a as W,
  s as a
};
