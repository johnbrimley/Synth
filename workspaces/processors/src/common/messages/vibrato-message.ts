import { Waveforms } from "../enums/waveforms";

export interface VibratoMessage{
    active: boolean;
    waveform: Waveforms;
    frequency: number;
    depth: number;
}