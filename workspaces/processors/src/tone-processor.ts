export type Waveform = 'sine' | 'square' | 'saw' | 'triangle'

export type ToneMessage =
  | { type: 'noteOn'; frequency: number; }
  | { type: 'noteOff'; frequency: number }
  | { type: 'setWaveform'; waveform: Waveform };

class ToneProcessor extends AudioWorkletProcessor {
  private frequencies = new Set<number>();
  private waveform: Waveform = 'square';
  constructor() {
    super();
    this.port.onmessage = (event: MessageEvent<ToneMessage>) => {
      const msg = event.data;
      switch (msg.type) {
        case 'noteOn':
          this.frequencies.add(msg.frequency)
          break;
        case 'noteOff':
          this.frequencies.delete(msg.frequency);
          break;
        case 'setWaveform':
          console.log(msg.waveform);
          this.waveform = msg.waveform;
          break;
      }
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    outputs.forEach((output) => {
      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i++) {
          //current frame is the total number of process calls since we started.
          const currentSample = currentFrame + i;
          let sampleSum = 0;
          this.frequencies.forEach((frequency) => {
            const period = (sampleRate/frequency);
            const phase = currentSample % period;
            const normalizedPhase = phase / period;
            sampleSum += this.determineOutputSample(normalizedPhase);
          });
          channel[i] = Math.tanh(sampleSum);
        }
      });
    });
    return true;
  }

  private determineOutputSample(normalizedPhase: number): number{
    switch (this.waveform) {
      case 'saw':
        return 2 * normalizedPhase - 1;
      case 'sine':
        return Math.sin(2 * Math.PI * normalizedPhase);
      case 'triangle':
        return 4 * Math.abs(normalizedPhase - 0.5) - 1;
      default:
        //we'll fall back to square I guess
        return normalizedPhase < 0.5 ? 1 : -1;
    }
  }
}

registerProcessor("tone-processor", ToneProcessor);

