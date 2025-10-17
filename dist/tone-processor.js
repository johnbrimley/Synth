/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
/*!*****************************************************!*\
  !*** ./workspaces/processors/src/tone-processor.ts ***!
  \*****************************************************/
__webpack_require__.r(__webpack_exports__);
class ToneProcessor extends AudioWorkletProcessor {
    frequencies = new Set();
    waveform = 'square';
    constructor() {
        super();
        this.port.onmessage = (event) => {
            const msg = event.data;
            switch (msg.type) {
                case 'noteOn':
                    this.frequencies.add(msg.frequency);
                    break;
                case 'noteOff':
                    this.frequencies.delete(msg.frequency);
                    break;
                case 'setWaveform':
                    console.log(msg.waveform);
                    this.waveform = msg.waveform;
                    break;
            }
        };
    }
    process(inputs, outputs) {
        outputs.forEach((output) => {
            output.forEach((channel) => {
                for (let i = 0; i < channel.length; i++) {
                    //current frame is the total number of process calls since we started.
                    const currentSample = currentFrame + i;
                    let sampleSum = 0;
                    this.frequencies.forEach((frequency) => {
                        const period = (sampleRate / frequency);
                        const phase = currentSample % period;
                        const normalizedPhase = phase / period;
                        sampleSum += this.determineOutputSample(normalizedPhase);
                    });
                    channel[i] = Math.tanh(sampleSum);
                }
            });
        });
        return true;
    }
    determineOutputSample(normalizedPhase) {
        switch (this.waveform) {
            case 'saw':
                return 2 * normalizedPhase - 1;
            case 'sine':
                return Math.sin(2 * Math.PI * normalizedPhase);
            case 'triangle':
                return 4 * Math.abs(normalizedPhase - 0.5) - 1;
            default:
                //we'll fall back to square I guess
                return normalizedPhase < 0.5 ? 1 : -1;
        }
    }
}
registerProcessor("tone-processor", ToneProcessor);



//# sourceMappingURL=tone-processor.js.map