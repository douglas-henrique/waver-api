import fs from 'fs'
// @ts-ignore
import { pipeline } from '@xenova/transformers'
// @ts-ignore
import { HfInference } from '@huggingface/inference'
const TOKEN = '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'
const hf = new HfInference(TOKEN)


export async function createSummary(text: string) {
    try {
        let start = performance.now();

        const result = await hf.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: text,
            parameters: {
                max_length: 500,
                
            }
        })
 
        let end = performance.now();
        console.log(`Summary execution duration: ${(end - start) / 1000} seconds`);

        return result
    } catch (error) {
        console.log(error)
        throw new Error('Summary error')
    }
}