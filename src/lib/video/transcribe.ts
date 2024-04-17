import fs from 'fs'
import { pipeline } from '@xenova/transformers'
import wavefile from 'wavefile';
import { HfInference } from '@huggingface/inference'
const TOKEN = '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'
const hf = new HfInference(TOKEN)
const options = { //Xenova/whisper-small configurations
    chunk_length_s: 30,
    stride_length_s: 5,
    language: 'portuguese',
    task: 'transcribe',
}

const WaveFile = wavefile.WaveFile;


export async function transcribeAudio(fileName: string) {

    let data = null;

    try {

        const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');

        let buffer = fs.readFileSync(fileName) //file buffer

        let wav = new WaveFile(buffer); // start .wav processing
        wav.toBitDepth('32f');
        wav.toSampleRate(16000);
        let audioData = wav.getSamples();

        if (Array.isArray(audioData)) {
            audioData = audioData[0];
        }

        let start = performance.now();

        data = await transcriber(audioData, options); // process transcribe

        let end = performance.now();

        fs.unlink(fileName, (err) => {
            if (err) {
                throw new Error(err.message)
            }
        })

    } catch (error) {
        throw new Error('Error')
    } finally {
        return data
    }
}