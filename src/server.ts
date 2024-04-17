import fastify from 'fastify'
import { z } from "zod"
import { downloadVideo } from './lib/video/download'
import { createMP3 } from './lib/video/convert'
import { transcribeAudio } from './lib/video/transcribe'
import { createSummary } from './lib/video/summary'
const app = fastify()

app.post('/api/transcript', async (request, reply) => {
  const createVideoSchema = z.object({
    videoUrl: z.string().min(3),
  })

  const { videoUrl } = createVideoSchema.parse(request.body)

  try {
    const { videoName, error } = await downloadVideo(videoUrl)
    if (!error && videoName) {
      try {
        const { fileName, error } = await createMP3(videoName)
        if (!error && fileName) {
          const readyText = await transcribeAudio(fileName)

          console.log(`[VIDEO TEXT GENERATED]`)
          console.log(`[STARTING SUMMARY]`)

          // @ts-ignore
          const summary = await createSummary(readyText?.text ?? '');
          console.log(`[SUMMARY COMPLETED]`)

          // @ts-ignore
          return reply.status(200).send({ text: readyText?.text, summary: summary?.summary_text });

        }
      }
      catch (error) {
        console.log('[ERROR CONVERTING VIDEO]', error)
        return reply.status(500).send({ error });
      }
    }
  } catch (error) {
    console.log('[ERROR DOWNLOADING VIDEO]', error)
    return reply.status(500).send({ error });
  }


})

app.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP server running!')
})