/******/ var __webpack_modules__ = ({

/***/ "./workspaces/processors/src/delay-buffer.ts":
/*!***************************************************!*\
  !*** ./workspaces/processors/src/delay-buffer.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DelayBuffer: () => (/* binding */ DelayBuffer)
/* harmony export */ });
class DelayBuffer {
    buffer;
    index = 0;
    constructor(size) {
        this.buffer = new Float32Array(size);
    }
    pushPop(sample) {
        const delayedSample = this.buffer[this.index];
        this.buffer[this.index] = sample;
        this.index = (this.index + 1) % this.buffer.length;
        return delayedSample;
    }
}


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
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
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************************!*\
  !*** ./workspaces/processors/src/chorus-processor.ts ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _delay_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./delay-buffer */ "./workspaces/processors/src/delay-buffer.ts");

class ChorusProcessor extends AudioWorkletProcessor {
    delay = 0;
    delayBuffers = null;
    constructor() {
        super();
        this.port.onmessage = (event) => {
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
    process(inputs, outputs) {
        if (this.delayBuffers === null) {
            this.delayBuffers = inputs.map(input => input.map(() => new _delay_buffer__WEBPACK_IMPORTED_MODULE_0__.DelayBuffer(this.delay)));
        }
        if (this.delay == 0) {
            this.passthrough(inputs, outputs);
            return true;
        }
        for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
            const inputDelayBuffer = this.delayBuffers[inputIndex];
            const input = inputs[inputIndex];
            for (let channelIndex = 0; channelIndex < input.length; channelIndex++) {
                const inputChannel = input[channelIndex];
                const outputChannel = outputs[inputIndex][channelIndex];
                const delayedBuffer = this.delayBuffers[inputIndex][channelIndex];
                for (let sample = 0; sample < inputChannel.length; sample++) {
                    const delayedSample = delayedBuffer.pushPop(inputChannel[sample]);
                    outputChannel[sample] = inputChannel[sample] + delayedSample;
                }
            }
        }
        return true;
    }
    passthrough(inputs, outputs) {
        for (let inputIndex = 0; inputIndex < inputs.length; inputIndex++) {
            const input = inputs[inputIndex];
            for (let channelIndex = 0; channelIndex < input.length; channelIndex++) {
                const inputChannel = input[channelIndex];
                const outputChannel = outputs[inputIndex][channelIndex];
                for (let sample = 0; sample < inputChannel.length; sample++) {
                    outputChannel[sample] = inputChannel[sample];
                }
            }
        }
    }
}
registerProcessor("chorus-processor", ChorusProcessor);

})();


//# sourceMappingURL=chorus-processor.js.map