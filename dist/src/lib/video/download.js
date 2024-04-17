"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadVideo = void 0;
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const fs_1 = __importDefault(require("fs"));
const downloadVideo = (videoURL) => new Promise((resolve, reject) => {
    console.log('[VIDEO DOWNLOADING]', videoURL);
    const timestamp = Math.round(new Date().getTime() / 1000);
    const videoName = `${timestamp}.mp4`;
    (0, ytdl_core_1.default)(videoURL, { filter: 'audioonly', quality: 'lowestaudio' })
        .on('end', () => {
        console.log('[DOWNLOAD FINISHED]');
        resolve({ videoName });
    }).on('error', () => {
        console.log('[ERROR DOWNLOAD]');
        reject({
            error: '[ERROR_DOWNLOADING_VIDEO]'
        });
    })
        .pipe(fs_1.default.createWriteStream(videoName));
});
exports.downloadVideo = downloadVideo;
