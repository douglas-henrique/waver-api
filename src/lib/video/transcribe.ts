import fs from 'fs'
import { WaveFile } from 'wavefile';
const TOKEN = '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'
const options = { //Xenova/whisper-small configurations
    chunk_length_s: 30,
    stride_length_s: 5,
    language: 'portuguese',
    task: 'transcribe',
}



export async function transcribeAudio(fileName: string) {

    const { pipeline } = await import('@xenova/transformers')
    

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


        data = await transcriber(audioData, options); // process transcribe

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