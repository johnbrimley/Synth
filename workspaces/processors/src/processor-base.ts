export abstract class ProcessorBase extends AudioWorkletProcessor implements AudioWorkletProcessorImpl  {
    readonly port: MessagePort;
    constructor(){
        super();
        this.port = (this as any).port;
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
        for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
            const input = inputs[inputIndex];
            for (let channelIndex = 0; channelIndex < input.length; channelIndex++){
                const inputChannel = input[channelIndex];
                const outputChannel =  outputs[inputIndex][channelIndex];
                for(let sample = 0; sample < inputChannel.length; sample++){
                   outputChannel[sample] = this.processSample(inputChannel[sample]);
                }
            }
        }
        return true;
    }

    protected abstract processSample(inputSample: number):number;
}
