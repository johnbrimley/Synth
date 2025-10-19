import { Waveform } from "../enums/waveforms";

export interface ToneMessage {
    waveform?: Waveform;
    addFrequency?: number;
    removeFrequency?: number;
}