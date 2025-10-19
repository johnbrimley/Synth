import { P as e } from "./processor-base.js";
class s extends e {
  processSample(r) {
    return Math.tanh(r);
  }
}
registerProcessor("hyperbolic-tangent-processor", s);
