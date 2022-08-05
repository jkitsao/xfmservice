// const Fs = require('fs');
const express = require('express')
// import got from 'got';
const https = require('https');
// const Stream = require('stream')
const EventEmitter = require('events');
const { PassThrough } = require('stream');
const Throttle = require('throttle');
const Utils = require('./utils');
const DB = require('./db/db.js')
const cors = require('cors');

const { ffprobeSync } = require('@dropb/ffprobe');
var app = express()
app.use(cors({
    origin: '*'
}));
//create the read stream
// var stream = fs.createReadStream("/playlist/audio1.mp3");
// const initsong = "comedy.mp3"
var nowPlaying = ''
const songs = []
const currentListeners = []
let data = DB.catalogue

// const writables = [writable1, writable2, writable3];
let sinks = new Map();
const stream = new EventEmitter()

const broadcastToEverySink = (chunk) => {
    for (const [, sink] of sinks) {
        sink.write(chunk);
    }
}

const getBitRate = (song) => {
    // try {
    //     const bitRate = ffprobeSync(Path.join(process.cwd(), song)).format.bit_rate;
    //     return parseInt(bitRate);
    // }
    // catch (err) {
    //     return 320000; 
    // }
    return 128000;
}

const makeResponseSink = () => {
    const id = Utils.generateRandomId();
    const responseSink = PassThrough();
    sinks.set(id, responseSink);
    return { id, responseSink };
}

const removeResponseSink = (id) => {
    sinks.delete(id);
}
const playLoop = () => {
    // console.log({ songs })
    let currentSong = Utils.randomNoRepeats(data)
    const bitRate = getBitRate(currentSong.src);
    // const songReadable = Fs.createReadStream(this._currentSong);
    https.get(currentSong.src, (stream) => {
        const throttleTransformable = new Throttle(bitRate / 8);
        throttleTransformable.on('data', (chunk) => broadcastToEverySink(chunk));
        throttleTransformable.on('end', () => playLoop());
        stream.emit('play', currentSong.src);
        nowPlaying = currentSong.name
        // songReadable.pipe(throttleTransformable);
        stream.pipe(throttleTransformable);
    });
}
const startStreaming = () => {
    playLoop();
}
//
app.get('/', (req, res) => {
    res.send('up and running')
})

//streaming route
app.get('/listen', function (req, res) {
    const { responseSink } = makeResponseSink();
    currentListeners.push(responseSink)
    // req.app
    res.set({
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked'
    });
    // res.send(responseSink)
    responseSink.pipe(res)
});
//now playing route
//streaming route
app.get('/playing', function (req, res) {
    // const { responseSink } = makeResponseSink();
    function removeExtension(filename) {
        return filename.substring(0, filename.lastIndexOf('.')) || filename;
    }
    if (nowPlaying) {
        return res.json(({ listeners: currentListeners.length, playing: removeExtension(nowPlaying) }))
    }
    return res.json({ playing: false })
});

const port = process.env.PORT || 8080
app.listen(port, () => {
    startStreaming()
    // fillWithItems(Utils.readSongs());
    // console.log({ db })
    console.log(`up and running on port ${port}`)
})