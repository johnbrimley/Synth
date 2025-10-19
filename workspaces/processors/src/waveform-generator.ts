import { Waveforms } from "./common/enums/waveforms";
import { Oscillator } from "./oscillator";

type WaveFunc = (phase: number) => number;

export class WaveformGenerator {

    private readonly waveformFunction: WaveFunc;
    constructor(private waveform: Waveforms, private oscillator: Oscillator) {
        this.waveformFunction = this.createWaveformFunction(waveform);
    }

    private createWaveformFunction(waveform: Waveforms): (phase: number) => number {
        switch (waveform) {
            case Waveforms.Sine:
                return p => Math.sin(2 * Math.PI * p);
            case Waveforms.Square:
                return p => (p < 0.5 ? 1 : -1);
            case Waveforms.Saw:
                return p => (2 * p) - 1;
            case Waveforms.Triangle:
                return p => 4 * Math.abs(p - 0.5) - 1;
            default:
                throw new Error(`Unsupported waveform: ${waveform}`);
        }
    }

    sampleAt(sampleIndex: number): number {
        return this.waveformFunction(this.oscillator.phaseAt(sampleIndex));
    }
}