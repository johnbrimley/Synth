import { W as t, a, O as o } from "./waveform-generator.js";
import { P as n } from "./processor-base.js";
class m extends n {
  generators = /* @__PURE__ */ new Map();
  waveform = t.Square;
  constructor() {
    super(), this.port.onmessage = (s) => {
      const e = s.data;
      if (e.addFrequency && this.generators.set(e.addFrequency, new a(this.waveform, new o(sampleRate, e.addFrequency))), e.removeFrequency && this.generators.delete(e.removeFrequency), e.waveform) {
        this.waveform = e.waveform;
        for (let r of this.generators.keys())
          this.generators.set(r, new a(this.waveform, new o(sampleRate, r)));
      }
    };
  }
  processSample(s) {
    let e = 0;
    return this.generators.forEach((r) => {
      e += r.sampleAt(this.sampleIndex);
    }), e;
  }
}
registerProcessor("tone-processor", m);
