import ytdl from 'ytdl-core'
import fs from 'fs';

export const downloadVideo = (videoURL: string) => new Promise<{ videoName?: string, error?: string}>((resolve, reject) => {

    const timestamp = Math.round(new Date().getTime() / 1000)
    const videoName = `${timestamp}.mp4`
    ytdl(videoURL, { filter: 'audioonly', quality: 'lowestaudio' })
        .on('end', () => {
            resolve({ videoName })
        }).on('error', () => {
            reject({
                error: '[ERROR_DOWNLOADING_VIDEO]'
            })
        })
        .pipe(fs.createWriteStream(videoName))
})