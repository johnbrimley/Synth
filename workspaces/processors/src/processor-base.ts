export abstract class ProcessorBase extends AudioWorkletProcessor implements AudioWorkletProcessorImpl  {
    //The size of the render quantum for the AudioWorkletProcessor is 128 sample-frames and cannot be changed.
    private static readonly EMPTY_BUFFER = new Float32Array(128);
    protected sampleIndex:number = 0;
    readonly port: MessagePort;
    constructor(){
        super();
        this.port = super.port;
    }
    process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
        for (let outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
          const output = outputs[outputIndex];
          const input = inputs[outputIndex];
      
          for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
            const inputChannel = input[channelIndex] ?? ProcessorBase.EMPTY_BUFFER;
            const outputChannel = output[channelIndex];
      
            for (let frameSampleIndex = 0; frameSampleIndex < outputChannel.length; frameSampleIndex++) {
                this.sampleIndex = currentFrame + frameSampleIndex;
              outputChannel[frameSampleIndex] = this.processSample(inputChannel[frameSampleIndex]);
            }
          }
        }
        return true;
      }

    protected abstract processSample(inputSample: number):number;
}
