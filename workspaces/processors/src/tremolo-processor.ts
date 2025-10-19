import { Waveforms } from "./common/enums/waveforms";
import { TremoloMessage } from "./common/messages/tremolo-message";
import { Oscillator } from "./oscillator";
import { ProcessorBase } from "./processor-base";
import { WaveformGenerator } from "./waveform-generator";


class TremoloProcessor extends ProcessorBase {
    private depth: number = .5;
    private active: boolean = true;
    private frequency: number = 5;
    private waveform: Waveforms = Waveforms.Sine;
    private generator: WaveformGenerator = new WaveformGenerator(this.waveform, new Oscillator(sampleRate, this.frequency));
    constructor() {
        super();
        this.port.onmessage = (event: MessageEvent<TremoloMessage>) => {
            const message = event.data;
            if (message.active) {
                this.active = message.active;
              }
            
              if (message.depth) {
                this.depth = message.depth;
              }
            
              if (message.frequency) {
                // rebuild the generator at new frequency
                this.frequency = message.frequency;
                this.generator = new WaveformGenerator(
                  this.waveform,
                  new Oscillator(sampleRate, message.frequency)
                );
              }
            
              if (message.waveform) {
                // rebuild the generator at new waveform
                this.waveform = message.waveform;
                this.generator = new WaveformGenerator(
                  message.waveform,
                  new Oscillator(sampleRate, this.frequency)
                );
              }
        };
    }

    protected override processSample(inputSample: number): number {
        if(!this.active)
            return inputSample;

        const tremoloDepth = this.generator.sampleAt(this.sampleIndex) * this.depth;
        return inputSample * (1 + tremoloDepth);
    }
}

registerProcessor("tremolo-processor", TremoloProcessor);