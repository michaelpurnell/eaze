'use strict'
var https = require('https'),
tar = require('tar'),
zlib = require('zlib');

function downloadPackages (count, callback) {

	console.log("reading");

	var req = https.get('https://registry.npmjs.org/lodash/-/lodash-4.17.4.tgz');
	req.on('response', function(res) {
    res
        .pipe(zlib.createGunzip())
        .pipe(tar.x({path:'/.packages/', strip: 1}))
});
}

module.exports.downloadPackages = downloadPackages
