import { ProcessorBase } from "./processor-base";

class VibratoProcessor extends ProcessorBase {
    private frequency: number = 10;
    private phase = sampleRate / this.frequency;

    protected override processSample(inputSample: number): number {
        return Math.tanh(inputSample);
    }
}

registerProcessor("vibrato-processor", VibratoProcessor);