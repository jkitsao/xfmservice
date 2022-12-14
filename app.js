// const Fs = require('fs');
const express = require('express')
// import got from 'got';
const https = require('https');
// const Stream = require('stream')
const _ = require('underscore');
const EventEmitter = require('events');
const { PassThrough } = require('stream');
const Throttle = require('throttle');
const Utils = require('./utils');
const DB = require('./db/db.js')
const alt = require('./db/alternative.js')
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
let CatalogueSongs = DB.catalogue
let alt_catalogue = alt.catalogue

// const writables = [writable1, writable2, writable3];
let sinks = new Map();
// const stream = new EventEmitter()

const broadcastToEverySink = (chunk) => {
    for (const [, sink] of sinks) {
        sink.write(chunk);
    }
}

const getBitRate = (song) => {
    try {
        const bitRate = ffprobeSync(song).format.bit_rate;
        console.log({ bitRate })
        return parseInt(bitRate);
    }
    catch (err) {
        console.log('bitrate error ')
        return 128000;
    }
    // return ;
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
//logic to generate random song
const generateRandomSong = () => {
    let shuffledSongs = _.shuffle(CatalogueSongs.concat(alt_catalogue))
    var copy = shuffledSongs.slice(0);
    return (function () {
        if (copy.length < 1) { copy = array.slice(0); }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        console.log({ item })
        return item;
    })()
}


const playLoop = () => {
    // generate random song
    let currentSong = generateRandomSong()
    // console.log({ currentSong })
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

const PORT = process.env.PORT || 8080
// app.listen(port, () => {
//     startStreaming()
//     console.log(`up and running on port ${port}`)
// })
app.listen(PORT, function (err) {
    if (err) console.error(err)
    startStreaming()
    console.log("Server listening on Port", PORT);
})