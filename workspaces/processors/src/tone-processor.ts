import { Waveform } from "./enums/Waveforms";
import { Oscillator } from "./oscillator";
import { ProcessorBase } from "./processor-base";
import { WaveformGenerator } from "./waveform-generator";


export type ToneMessage =
  | { type: 'noteOn'; frequency: number; }
  | { type: 'noteOff'; frequency: number }
  | { type: 'setWaveform'; waveform: Waveform };

class ToneProcessor extends ProcessorBase {
  private generators = new Map<number, WaveformGenerator>();
  private waveform: Waveform = Waveform.Square;
  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent<ToneMessage>) => {
      const msg = event.data;
      switch (msg.type) {
        case 'noteOn':
          this.generators.set(msg.frequency, new WaveformGenerator(this.waveform, new Oscillator(sampleRate, msg.frequency)));
          break;
        case 'noteOff':
          this.generators.delete(msg.frequency);
          break;
        case 'setWaveform':
          this.waveform = msg.waveform;
          for(let key of this.generators.keys()){
            this.generators.set(key, new WaveformGenerator(this.waveform, new Oscillator(sampleRate, key)));
          }
          break;
      }
    };
  }

  // process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
  //   return super.process(inputs,outputs);
  // }

  protected override processSample(inputSample: number): number {
    let sampleSum = 0;
    this.generators.forEach((generator)=>{
      sampleSum += generator.sampleAt(this.sampleIndex);
    });
    return sampleSum;
  }
}

registerProcessor("tone-processor", ToneProcessor);

