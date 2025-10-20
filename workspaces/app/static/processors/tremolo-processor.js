import { W as a, a as t, O as r } from "./waveform-generator.js";
import { P as o } from "./processor-base.js";
class i extends o {
  depth = 0;
  settings = {
    active: !1,
    waveform: a.Sine,
    frequency: 0,
    depth: 0
  };
  generator = new t(this.settings.waveform, new r(sampleRate, this.settings.frequency));
  constructor() {
    super(), this.port.onmessage = (e) => {
      this.settings = e.data, this.depth = this.settings.depth, this.generator = new t(this.settings.waveform, new r(sampleRate, this.settings.frequency));
    };
  }
  process(e, s) {
    return this.settings.active ? super.process(e, s) : o.passthrough(e, s);
  }
  processSample(e) {
    const s = this.generator.sampleAt(this.sampleIndex) * this.depth;
    return e * (1 + s);
  }
}
registerProcessor("tremolo-processor", i);
