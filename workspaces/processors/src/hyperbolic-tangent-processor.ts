import { ProcessorBase } from "./processor-base";

class HyperbolicTangentProcessor extends ProcessorBase {
    protected override processSample(inputSample: number): number {
        return Math.tanh(inputSample);
    }
}

registerProcessor("hyperbolic-tangent-processor", HyperbolicTangentProcessor);