import { W as o, a as t, O as s } from "./waveform-generator.js";
import { P as a } from "./processor-base.js";
class i extends a {
  depth = 0.5;
  active = !0;
  frequency = 5;
  waveform = o.Sine;
  generator = new t(this.waveform, new s(sampleRate, this.frequency));
  constructor() {
    super(), this.port.onmessage = (r) => {
      const e = r.data;
      e.active && (this.active = e.active), e.depth && (this.depth = e.depth), e.frequency && (this.frequency = e.frequency, this.generator = new t(
        this.waveform,
        new s(sampleRate, e.frequency)
      )), e.waveform && (this.waveform = e.waveform, this.generator = new t(
        e.waveform,
        new s(sampleRate, this.frequency)
      ));
    };
  }
  processSample(r) {
    if (!this.active)
      return r;
    const e = this.generator.sampleAt(this.sampleIndex) * this.depth;
    return r * (1 + e);
  }
}
registerProcessor("tremolo-processor", i);
