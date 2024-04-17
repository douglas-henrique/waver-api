"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMP3 = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fs_1 = __importDefault(require("fs"));
const createMP3 = (videoName) => new Promise((resolve, reject) => {
    fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default ?? '');
    const fileName = videoName.replace(".mp4", '') + '.wav';
    (0, fluent_ffmpeg_1.default)()
        .input(videoName)
        .outputOptions('-ab', '192k')
        .saveToFile(fileName)
        .on('progress', (progress) => {
        if (progress.percent) {
            console.log(`Processing: ${Math.floor(progress.percent)}% done`);
        }
    })
        .on('end', () => {
        fs_1.default.unlink(videoName, (err) => {
            if (!err) {
                console.log('FFmpeg has finished.');
                resolve({
                    fileName
                });
            }
            reject({
                err
            });
        });
    })
        .on('error', (error) => {
        console.error(error);
        reject({
            error
        });
    });
});
exports.createMP3 = createMP3;
