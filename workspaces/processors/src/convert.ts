export class Convert{
    static toSamples(sampleRate: number, milliseconds: number){
        return (sampleRate / 1000) * milliseconds;
    }
}