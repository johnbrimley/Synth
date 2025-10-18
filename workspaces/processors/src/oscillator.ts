export class Oscillator {
    private readonly phaseIncrement: number;
    constructor(sampleRate: number, frequency: number) {
      this.phaseIncrement = frequency / sampleRate; 
    }
  
    public phaseAt(sampleIndex: number): number {
      return (sampleIndex * this.phaseIncrement) % 1; 
    }
  }