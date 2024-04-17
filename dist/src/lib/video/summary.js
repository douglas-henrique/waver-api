"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSummary = void 0;
// @ts-ignore
const inference_1 = require("@huggingface/inference");
const TOKEN = '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';
const hf = new inference_1.HfInference(TOKEN);
async function createSummary(text) {
    try {
        let start = performance.now();
        const result = await hf.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: text,
            parameters: {
                max_length: 500,
            }
        });
        let end = performance.now();
        console.log(`Summary execution duration: ${(end - start) / 1000} seconds`);
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error('Summary error');
    }
}
exports.createSummary = createSummary;
