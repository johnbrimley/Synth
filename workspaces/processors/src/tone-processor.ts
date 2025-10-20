import { Waveforms } from "./common/enums/waveforms";
import { ToneMessage } from "./common/messages/tone-message";
import { Convert } from "./convert";
import { Oscillator } from "./oscillator";
import { ProcessorBase } from "./processor-base";
import { WaveformGenerator } from "./waveform-generator";

class ToneProcessor extends ProcessorBase {
  private generators = new Map<number, WaveformGenerator>();
  private attacks = new Map<number, number>();
  private releases = new Map<number, number>();
  private waveform: Waveforms = Waveforms.Square;
  private attackSampleIncrementor: number = 1 / Convert.toSamples(sampleRate, 100);
  private releaseSampleDecrementor: number = 1 / Convert.toSamples(sampleRate, 100);
  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent<ToneMessage>) => {
      const message = event.data;
      if (message.addFrequency) {
        this.generators.set(message.addFrequency, new WaveformGenerator(this.waveform, new Oscillator(sampleRate, message.addFrequency)));
        let initialValue = 0;
        if (this.releases.has(message.addFrequency)) {
          initialValue = this.releases.get(message.addFrequency)!
          this.releases.delete(message.addFrequency);
        }
        this.attacks.set(message.addFrequency, 0);
      }
      if (message.removeFrequency) {
        let initialValue = 1;
        if (this.attacks.has(message.removeFrequency)) {
          initialValue = this.attacks.get(message.removeFrequency)!
          this.attacks.delete(message.removeFrequency);
        }
        this.releases.set(message.removeFrequency, initialValue);
      }
      if (message.waveform) {
        this.waveform = message.waveform;
        for (let key of this.generators.keys()) {
          this.generators.set(key, new WaveformGenerator(this.waveform, new Oscillator(sampleRate, key)));
        }
      }
      if (message.attack) {
        this.attackSampleIncrementor = 1 / Convert.toSamples(sampleRate, message.attack);
      }
      if (message.release) {
        this.releaseSampleDecrementor = 1 / Convert.toSamples(sampleRate, message.release);
      }

    };
  }

  protected override processSample(inputSample: number): number {
    let sampleSum = 0;
    const keys = Array.from(this.generators.keys());

    for (const key of keys) {
      const sample = this.generators.get(key)!.sampleAt(this.sampleIndex);
      if (this.attacks.has(key)) {
        const attack = this.attacks.get(key)!;
        sampleSum += sample * attack;
        const incrementedAttack = attack + this.attackSampleIncrementor;
        if (incrementedAttack < 1) {
          this.attacks.set(key, incrementedAttack);
        }
        else {
          this.attacks.delete(key);
        }
      }
      else if (this.releases.has(key)) {
        const release = this.releases.get(key)!;
        sampleSum += sample * release;
        const decrementedRelease = release - this.releaseSampleDecrementor;
        if (decrementedRelease > 0) {
          this.releases.set(key, decrementedRelease);
        }
        else {
          this.releases.delete(key);
          this.generators.delete(key);
        }
      }
      else {
        sampleSum += sample;
      }
    }
    return sampleSum;
  }
}

registerProcessor("tone-processor", ToneProcessor);

