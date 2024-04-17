"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = void 0;
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const transformers_1 = require("@xenova/transformers");
const wavefile_1 = require("wavefile");
// @ts-ignore
const inference_1 = require("@huggingface/inference");
const TOKEN = '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';
const hf = new inference_1.HfInference(TOKEN);
const options = {
    chunk_length_s: 30,
    stride_length_s: 5,
    language: 'portuguese',
    task: 'transcribe',
};
async function transcribeAudio(fileName) {
    let data = null;
    try {
        console.log('[STARTING TRANSCRIBE]');
        const transcriber = await (0, transformers_1.pipeline)('automatic-speech-recognition', 'Xenova/whisper-small');
        let buffer = fs_1.default.readFileSync(fileName); //file buffer
        let wav = new wavefile_1.WaveFile(buffer); // start .wav processing
        wav.toBitDepth('32f');
        wav.toSampleRate(16000);
        let audioData = wav.getSamples();
        if (Array.isArray(audioData)) {
            audioData = audioData[0];
        }
        let start = performance.now();
        data = await transcriber(audioData, options); // process transcribe
        let end = performance.now();
        fs_1.default.unlink(fileName, (err) => {
            if (err) {
                throw new Error(err.message);
            }
        });
        console.log(`Transcribe execution duration: ${(end - start) / 1000} seconds`);
    }
    catch (error) {
        console.log('[ERROR TRANSCRIBE]', error);
        throw new Error('Error');
    }
    finally {
        return data;
    }
}
exports.transcribeAudio = transcribeAudio;
