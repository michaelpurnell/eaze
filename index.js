'use strict'
var https = require('https'),
tar = require('tar'),
zlib = require('zlib'),
request = require('request'),
fs = require('fs'),
unzip = require('unzip');

function downloadPackages (count, callback) {

	var url = 'https://registry.npmjs.org/lodash/-/lodash-4.17.4.tgz';
	console.log("reading");

// 	var req = https.get(url);
// 	req.on('response', function(res) {
//     res
//         .pipe(zlib.createGunzip())
//         .pipe(tar.x({path:'./packages/', strip: 1}))
// });

//creates the tgz file but doesent extract contents
request(url).pipe(fs.createWriteStream('./packages/lodash.tgz'));

}

module.exports.downloadPackages = downloadPackages
