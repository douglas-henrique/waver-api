"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const zod_1 = require("zod");
const download_1 = require("./lib/video/download");
const convert_1 = require("./lib/video/convert");
const transcribe_1 = require("./lib/video/transcribe");
const summary_1 = require("./lib/video/summary");
const app = (0, fastify_1.default)();
app.post('/api/transcript', async (request, reply) => {
    const createVideoSchema = zod_1.z.object({
        videoUrl: zod_1.z.string().min(3),
    });
    const { videoUrl } = createVideoSchema.parse(request.body);
    try {
        const { videoName, error } = await (0, download_1.downloadVideo)(videoUrl);
        if (!error && videoName) {
            try {
                const { fileName, error } = await (0, convert_1.createMP3)(videoName);
                if (!error && fileName) {
                    const readyText = await (0, transcribe_1.transcribeAudio)(fileName);
                    console.log(`[VIDEO TEXT GENERATED]`);
                    console.log(`[STARTING SUMMARY]`);
                    // @ts-ignore
                    const summary = await (0, summary_1.createSummary)(readyText?.text ?? '');
                    console.log(`[SUMMARY COMPLETED]`);
                    // @ts-ignore
                    return reply.status(200).send({ text: readyText?.text, summary: summary?.summary_text });
                }
            }
            catch (error) {
                console.log('[ERROR CONVERTING VIDEO]', error);
                return reply.status(500).send({ error });
            }
        }
    }
    catch (error) {
        console.log('[ERROR DOWNLOADING VIDEO]', error);
        return reply.status(500).send({ error });
    }
});
app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running!');
});
