// const Fs = require('fs');
// const { extname } = require('path');
var _ = require('underscore');
// const _readDir = () => Fs.readdirSync('./playlist', { withFileTypes: true });
// const _isMp3 = item => item.isFile && extname(item.name) === '.mp3';

// exports.readSong = () => _readDir().filter(_isMp3)[0].name;
// exports.readSongs = () => _readDir().filter(_isMp3).map((songItem) => songItem.name);

// exports.discardFirstWord = str => str.substring(str.indexOf('') + 1);
// exports.getFirstWord = str => str.split(' ')[0];

exports.generateRandomId = () => Math.random().toString(36).slice(2);

exports.randomNoRepeats = (array) => {
    let newArray = _.shuffle(array)
    var copy = newArray.slice(0);
    // return function () {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    console.log({ item })
    return item;
    // };
}
