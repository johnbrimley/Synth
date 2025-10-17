export class DelayBuffer{
    private buffer: Float32Array;
    private index: number = 0;

    constructor(size: number){
        this.buffer = new Float32Array(size);
    }

    pushPop(sample: number): number{
        const delayedSample = this.buffer[this.index];
        this.buffer[this.index] = sample;
        this.index = (this.index + 1) % this.buffer.length;
        return delayedSample;
    }
}