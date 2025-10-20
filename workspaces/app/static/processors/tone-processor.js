import { W as i, a as c, O as m } from "./waveform-generator.js";
import { C as o } from "./convert.js";
import { P as h } from "./processor-base.js";
class p extends h {
  generators = /* @__PURE__ */ new Map();
  attacks = /* @__PURE__ */ new Map();
  releases = /* @__PURE__ */ new Map();
  waveform = i.Square;
  attackSampleIncrementor = 1 / o.toSamples(sampleRate, 100);
  releaseSampleDecrementor = 1 / o.toSamples(sampleRate, 100);
  constructor() {
    super(), this.port.onmessage = (l) => {
      const e = l.data;
      if (e.addFrequency && (this.generators.set(e.addFrequency, new c(this.waveform, new m(sampleRate, e.addFrequency))), this.releases.has(e.addFrequency) && (this.releases.get(e.addFrequency), this.releases.delete(e.addFrequency)), this.attacks.set(e.addFrequency, 0)), e.removeFrequency) {
        let t = 1;
        this.attacks.has(e.removeFrequency) && (t = this.attacks.get(e.removeFrequency), this.attacks.delete(e.removeFrequency)), this.releases.set(e.removeFrequency, t);
      }
      if (e.waveform) {
        this.waveform = e.waveform;
        for (let t of this.generators.keys())
          this.generators.set(t, new c(this.waveform, new m(sampleRate, t)));
      }
      e.attack && (this.attackSampleIncrementor = 1 / o.toSamples(sampleRate, e.attack)), e.release && (this.releaseSampleDecrementor = 1 / o.toSamples(sampleRate, e.release));
    };
  }
  processSample(l) {
    let e = 0;
    const t = Array.from(this.generators.keys());
    for (const s of t) {
      const n = this.generators.get(s).sampleAt(this.sampleIndex);
      if (this.attacks.has(s)) {
        const a = this.attacks.get(s);
        e += n * a;
        const r = a + this.attackSampleIncrementor;
        r < 1 ? this.attacks.set(s, r) : this.attacks.delete(s);
      } else if (this.releases.has(s)) {
        const a = this.releases.get(s);
        e += n * a;
        const r = a - this.releaseSampleDecrementor;
        r > 0 ? this.releases.set(s, r) : (this.releases.delete(s), this.generators.delete(s));
      } else
        e += n;
    }
    return e;
  }
}
registerProcessor("tone-processor", p);
