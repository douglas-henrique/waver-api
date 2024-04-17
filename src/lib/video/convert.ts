import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import fs from 'fs'

export const createMP3 = (videoName: string) => new Promise<{ fileName?: string, error?: string }>((resolve, reject) => {
    ffmpeg.setFfmpegPath(ffmpegPath ?? '')
    const fileName = videoName.replace(".mp4", '') + '.wav'

    ffmpeg()
        .input(videoName)
        .outputOptions('-ab', '192k')
        .saveToFile(fileName)
        .on('progress', (progress) => {
            if (progress.percent) {
            }
        })
        .on('end', () => {
            fs.unlink(videoName, (err) => {
                if (!err) {
                    resolve({
                        fileName
                    })
                }

                reject({
                    err
                })
            })


        })
        .on('error', (error) => {
            console.error(error);
            reject({
                error
            })
        });
})
