import { W as a, a as r, O as t } from "./waveform-generator.js";
import { P as o } from "./processor-base.js";
class c extends o {
  depth = 0.5;
  active = !0;
  frequency = 5;
  waveform = a.Sine;
  generator = new r(this.waveform, new t(sampleRate, this.frequency));
  constructor() {
    super(), this.port.onmessage = (s) => {
      const e = s.data;
      switch (e.type) {
        case "setDepth":
          this.depth = e.depth;
          break;
        case "setActive":
          this.active = e.active;
          break;
        case "setFrequency":
          this.generator = new r(this.waveform, new t(sampleRate, e.frequency));
          break;
        case "setWaveform":
          this.generator = new r(e.waveform, new t(sampleRate, this.frequency));
          break;
      }
    };
  }
  processSample(s) {
    const e = this.generator.sampleAt(this.sampleIndex) * this.depth;
    return s * (1 + e);
  }
}
registerProcessor("tremolo-processor", c);
