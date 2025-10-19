import { Waveform } from "./common/enums/waveforms";
import { ToneMessage } from "./common/messages/tone-message";
import { Oscillator } from "./oscillator";
import { ProcessorBase } from "./processor-base";
import { WaveformGenerator } from "./waveform-generator";

class ToneProcessor extends ProcessorBase {
  private generators = new Map<number, WaveformGenerator>();
  private waveform: Waveform = Waveform.Square;
  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent<ToneMessage>) => {
      const message = event.data;
      if(message.addFrequency){
        this.generators.set(message.addFrequency, new WaveformGenerator(this.waveform, new Oscillator(sampleRate, message.addFrequency)));
      }
      if(message.removeFrequency){
        this.generators.delete(message.removeFrequency);
      }
      if(message.waveform){
        this.waveform = message.waveform;
          for(let key of this.generators.keys()){
            this.generators.set(key, new WaveformGenerator(this.waveform, new Oscillator(sampleRate, key)));
          }
      }
    };
  }

  protected override processSample(inputSample: number): number {
    let sampleSum = 0;
    this.generators.forEach((generator)=>{
      sampleSum += generator.sampleAt(this.sampleIndex);
    });
    return sampleSum;
  }
}

registerProcessor("tone-processor", ToneProcessor);

