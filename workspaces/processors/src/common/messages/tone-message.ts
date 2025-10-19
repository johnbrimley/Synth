import { Waveforms } from "../enums/waveforms";

export interface ToneMessage {
    waveform?: Waveforms;
    addFrequency?: number;
    removeFrequency?: number;
}