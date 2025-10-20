import { Waveforms } from "./common/enums/waveforms";
import { VibratoMessage } from "./common/messages/vibrato-message";
import { Convert } from "./convert";
import { DelayBuffer } from "./delay-buffer";
import { Oscillator } from "./oscillator";
import { ProcessorBase } from "./processor-base";
import { WaveformGenerator } from "./waveform-generator";

class VibratoProcessor extends AudioWorkletProcessor {
    private settings: VibratoMessage = {
        active: false,
        frequency: 0,
        waveform: Waveforms.Sine,
        depth: 0
    };
    private generator: WaveformGenerator = new WaveformGenerator(this.settings.waveform, new Oscillator(sampleRate, this.settings.frequency));
    private sampleDepth: number = Convert.toSamples(sampleRate, this.settings.depth);

    private delayBuffers: DelayBuffer[][] = [];

    constructor() {
        super();
        this.port.onmessage = (event: MessageEvent<VibratoMessage>) => {
            this.settings = event.data;
            this.generator = new WaveformGenerator(this.settings.waveform, new Oscillator(sampleRate, this.settings.frequency));
            this.sampleDepth = Convert.toSamples(sampleRate, this.settings.depth);
            this.delayBuffers = []; //reset these
        };
    }

    process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
        if(!this.settings.active)
            return ProcessorBase.passthrough(inputs,outputs);
        
        for (let outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
            const output = outputs[outputIndex];
            const input = inputs[outputIndex];

            if (!this.delayBuffers[outputIndex]) {
                this.delayBuffers[outputIndex] = [];
            }

            for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
                const inputChannel = input[channelIndex];
                const outputChannel = output[channelIndex];

                if (!this.delayBuffers[outputIndex][channelIndex]) {
                    this.delayBuffers[outputIndex][channelIndex] = new DelayBuffer(this.sampleDepth);
                }
                const channelBuffer = this.delayBuffers[outputIndex][channelIndex];

                for (let frameSampleIndex = 0; frameSampleIndex < outputChannel.length; frameSampleIndex++) {
                    const sampleOffset = this.generator.sampleAt(currentFrame + frameSampleIndex) * this.sampleDepth;
                    outputChannel[frameSampleIndex] = channelBuffer.readOffset(sampleOffset);
                    channelBuffer.push(inputChannel[frameSampleIndex]);
                }
            }
        }
        return true;
    }
}

registerProcessor("vibrato-processor", VibratoProcessor);