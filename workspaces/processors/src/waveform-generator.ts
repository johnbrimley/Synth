import { Waveform } from "./common/enums/waveforms";
import { Oscillator } from "./oscillator";

type WaveFunc = (phase: number) => number;

export class WaveformGenerator {

    private readonly waveformFunction: WaveFunc;
    constructor(private waveform: Waveform, private oscillator: Oscillator) {
        this.waveformFunction = this.createWaveformFunction(waveform);
    }

    private createWaveformFunction(waveform: Waveform): (phase: number) => number {
        switch (waveform) {
            case Waveform.Sine:
                return p => Math.sin(2 * Math.PI * p);
            case Waveform.Square:
                return p => (p < 0.5 ? 1 : -1);
            case Waveform.Saw:
                return p => (2 * p) - 1;
            case Waveform.Triangle:
                return p => 4 * Math.abs(p - 0.5) - 1;
            default:
                throw new Error(`Unsupported waveform: ${waveform}`);
        }
    }

    sampleAt(sampleIndex: number): number {
        return this.waveformFunction(this.oscillator.phaseAt(sampleIndex));
    }
}