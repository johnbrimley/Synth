import { Waveform } from "./common/enums/waveforms";
import { Oscillator } from "./oscillator";
import { ProcessorBase } from "./processor-base";
import { WaveformGenerator } from "./waveform-generator";

export type TremeloMessage =
    | { type: 'setActive'; active: boolean }
    | { type: 'setFrequency'; frequency: number; }
    | { type: 'setDepth'; depth: number; }
    | { type: 'setWaveform'; waveform: Waveform; };

class TremoloProcessor extends ProcessorBase {
    private depth: number = .5;
    private active: boolean = true;
    private frequency: number = 5;
    private waveform: Waveform = Waveform.Sine;
    private generator: WaveformGenerator = new WaveformGenerator(this.waveform, new Oscillator(sampleRate, this.frequency));
    constructor() {
        super();
        this.port.onmessage = (event: MessageEvent<TremeloMessage>) => {
            const msg = event.data;
            switch (msg.type) {
                case 'setDepth':
                    //convert from time to sample
                    this.depth = msg.depth;
                    break;
                case 'setActive':
                    //convert from time to sample
                    this.active = msg.active;
                    break;
                case 'setFrequency':
                    //convert from time to sample
                    this.generator = new WaveformGenerator(this.waveform, new Oscillator(sampleRate, msg.frequency));
                    break;
                case 'setWaveform':
                    //convert from time to sample
                    this.generator = new WaveformGenerator(msg.waveform, new Oscillator(sampleRate, this.frequency));
                    break;
            }
        };
    }

    protected override processSample(inputSample: number): number {
        const tremoloDepth = this.generator.sampleAt(this.sampleIndex) * this.depth;
        return inputSample * (1 + tremoloDepth);
    }
}

registerProcessor("tremolo-processor", TremoloProcessor);