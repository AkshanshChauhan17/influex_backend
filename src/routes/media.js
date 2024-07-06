const express = require("express");
const router = express.Router();
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const ffmpegPath = require("ffmpeg-static");
const { execFile, spawn } = require("child_process");

router.get('/get-image', async(req, res) => {
    const { url } = req.query;
    const imagePath = path.join(__dirname, "../../", url);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ message: 'Image not found' });
    }

    try {
        const lowResBuffer = await sharp(imagePath).resize(200).toBuffer();
        const highResBuffer = await sharp(imagePath).resize(1000).toBuffer();

        res.status(200).json({
            message: 'Images generated successfully',
            lowResImage: lowResBuffer.toString('base64'),
            highResImage: highResBuffer.toString('base64'),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing the image', error });
    }
});

router.get('/stream', (req, res) => {
    const { url } = req.query;
    const videoPath = path.join(__dirname, "../../", url);

    try {
        const range = req.headers.range
        if (!range)
            res.status(400).send('error')
        const videoSize = fs.statSync(videoPath).size

        const chunkSize = 10 ** 6;

        const start = Number(range.replace(/\D/g, ''))
        const end = Math.min(start + chunkSize, videoSize - 1)
        const contentLength = end - start + 1
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": 'bytes',
            "Content-Length": contentLength,
            "Content-Type": 'video/mp4'
        }

        res.writeHead(206, headers)

        const videoStream = fs.createReadStream(videoPath, { start, end })

        videoStream.pipe(res)
    } catch (err) {
        console.error(`Error streaming file: ${err}`);
    }
});

function streamThumbnail(videoPath, r, res) {
    var args = [
        '-i', videoPath, // Input file
        '-ss', '00:00:02', // Timestamp to take the thumbnail (2 seconds into the video)
        '-vframes', '1', // Number of frames to capture
        '-vf', `scale=-1:${r}`, // Size of the thumbnail
        '-f', 'image2pipe', // Output format to stream
        'pipe:1' // Output to stdout
    ];

    if (r > 1000) {
        args = [
            '-i', videoPath, // Input file
            '-ss', '00:00:02', // Timestamp to take the thumbnail (2 seconds into the video)
            '-vframes', '1', // Number of frames to capture
            '-vf', 'scale=-1:1000', // Size of the thumbnail
            '-f', 'image2pipe', // Output format to stream
            'pipe:1' // Output to stdout
        ];
    }

    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stdout.pipe(res);

    ffmpeg.on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).send('Failed to generate thumbnail');
    });

    ffmpeg.stderr.on('data', (data) => {
        // console.error(`FFmpeg stderr: ${data}`);
    });

    res.on('close', () => {
        ffmpeg.kill();
    });
}

router.get('/thumbnail', (req, res) => {
    const { url, r } = req.query;
    const videoFilePath = path.join(__dirname, "../../", url);

    res.writeHead(200, {
        'Content-Type': 'image/png'
    });

    streamThumbnail(videoFilePath, r, res);
});

module.exports = router;