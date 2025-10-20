import { Waveforms } from "./common/enums/waveforms";
import { TremoloMessage } from "./common/messages/tremolo-message";
import { Oscillator } from "./oscillator";
import { ProcessorBase } from "./processor-base";
import { WaveformGenerator } from "./waveform-generator";


class TremoloProcessor extends ProcessorBase {
  private depth: number =0;
    private settings: TremoloMessage = {
      active: false,
      waveform:Waveforms.Sine,
      frequency: 0,
      depth: 0
    };
    
    private generator: WaveformGenerator = new WaveformGenerator(this.settings.waveform, new Oscillator(sampleRate, this.settings.frequency));
    constructor() {
        super();
        this.port.onmessage = (event: MessageEvent<TremoloMessage>) => {
            this.settings =  event.data;
            this.depth = this.settings.depth;
            this.generator = new WaveformGenerator(this.settings.waveform, new Oscillator(sampleRate, this.settings.frequency));
        };
    }

    override process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
      if(!this.settings.active)
        return ProcessorBase.passthrough(inputs,outputs);
      else
        return super.process(inputs,outputs);
    }

    protected override processSample(inputSample: number): number {
        const tremoloDepth = this.generator.sampleAt(this.sampleIndex) * this.depth;
        return inputSample * (1 + tremoloDepth);
    }
}

registerProcessor("tremolo-processor", TremoloProcessor);