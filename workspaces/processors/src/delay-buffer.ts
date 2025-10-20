export class DelayBuffer {
    private readonly buffer: Float32Array;
    private readonly baseDelay: number;
    private writeIndex: number = 0;
    constructor(sampleDepth: number, baseDelay?: number) {
        this.baseDelay = baseDelay ?? sampleDepth;

        if(this.baseDelay < sampleDepth)
            throw new Error("baseDelay must be >= sampleDepth");

        this.buffer = new Float32Array(this.baseDelay + sampleDepth);
    }

    push(sample: number): void {
        this.buffer[this.writeIndex++] = sample;
        if (this.writeIndex === this.buffer.length)
            this.writeIndex = 0;
    }

    readOffset(sampleOffset: number): number {
        let readIndex = this.writeIndex - this.baseDelay + sampleOffset;
        readIndex = (readIndex % this.buffer.length + this.buffer.length) % this.buffer.length;
    
        const lowIndex = Math.floor(readIndex);
        const highIndex = (lowIndex + 1) % this.buffer.length;
        const fractional = readIndex - lowIndex;
    
        return (
            this.buffer[lowIndex] * (1 - fractional) +
            this.buffer[highIndex] * fractional
        );
    }
}