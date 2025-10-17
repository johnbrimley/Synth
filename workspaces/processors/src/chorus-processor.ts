import { DelayBuffer } from "./delay-buffer";


export type ChorusMessage =
    | { type: 'setDelay'; delayInMilliseconds: number; };

class ChorusProcessor extends AudioWorkletProcessor {
    private delay: number = 0;
    private delayBuffers: DelayBuffer[][] | null = null;

    constructor() {
        super();
        this.port.onmessage = (event: MessageEvent<ChorusMessage>) => {
            const msg = event.data;
            switch (msg.type) {
                case 'setDelay':
                    //convert from time to sample
                    const sampleDelay = Math.round((sampleRate / 1000) * msg.delayInMilliseconds);
                    this.delay = msg.delayInMilliseconds;
                    this.delayBuffers = null;
                    break;
            }
        };
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
        if (this.delayBuffers === null) {
            this.delayBuffers = inputs.map(input =>
                input.map(() => new DelayBuffer(this.delay))
            );
        }

        if(this.delay == 0){
            this.passthrough(inputs,outputs);
            return true;
        }

        for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
            const inputDelayBuffer = this.delayBuffers[inputIndex];
            const input = inputs[inputIndex];
            for (let channelIndex = 0; channelIndex < input.length; channelIndex++){
                const inputChannel = input[channelIndex];
                const outputChannel = outputs[inputIndex][channelIndex];
                const delayedBuffer = this.delayBuffers[inputIndex][channelIndex];
                for(let sample = 0; sample < inputChannel.length; sample++){
                    const delayedSample = delayedBuffer.pushPop(inputChannel[sample]);
                    outputChannel[sample] = inputChannel[sample] + delayedSample;
                }

            }
        }
        return true;
    }

    private passthrough(inputs: Float32Array[][], outputs: Float32Array[][]){
        for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
            const input = inputs[inputIndex];
            for (let channelIndex = 0; channelIndex < input.length; channelIndex++){
                const inputChannel = input[channelIndex];
                const outputChannel =  outputs[inputIndex][channelIndex];
                for(let sample = 0; sample < inputChannel.length; sample++){
                   outputChannel[sample] = inputChannel[sample];
                }
            }
        }
    }
}

registerProcessor("chorus-processor", ChorusProcessor);