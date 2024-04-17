import fastify from 'fastify'
import { boolean, z } from "zod"
import { downloadVideo } from './lib/video/download'
import { createMP3 } from './lib/video/convert'
import { transcribeAudio } from './lib/video/transcribe'
import { createSummary } from './lib/video/summary'
import cors from '@fastify/cors'
import 'dotenv/config'

const app = fastify()

app.register(cors, {
  origin: process.env.PROD_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true,
})


app.post('/api/transcript', async (request, reply) => {
  const createVideoSchema = z.object({
    videoUrl: z.string().min(3),
  })

  const { videoUrl } = createVideoSchema.parse(request.body)
  console.log('[START PROCESSING VIDEO SERVER] => ', videoUrl)


  try {
    const { videoName, error } = await downloadVideo(videoUrl)
    if (!error && videoName) {
      try {
        const { fileName, error } = await createMP3(videoName)
        if (!error && fileName) {
          const readyText = await transcribeAudio(fileName)

  
          // @ts-ignore
          const summary = await createSummary(readyText?.text ?? '');

          // @ts-ignore
          return reply.status(200).send({ text: readyText?.text, summary: summary?.summary_text });

        }
      }
      catch (error) {
        return reply.status(500).send({ error });
      }
    }
  } catch (error) {
    return reply.status(500).send({ error });
  }


})

app.listen({
  port: 3333,
}).then(() => { 
  console.log('[INITIALIZED SERVER]')
})