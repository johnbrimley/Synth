import { Waveforms } from "../enums/waveforms";

export interface TremoloMessage{
    active?: boolean;
    waveform?: Waveforms;
    frequency?: number;
    depth?: number;
}