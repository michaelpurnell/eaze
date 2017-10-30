'use strict'
var https = require('https'),
tar = require('tar'),
zlib = require('zlib'),
request = require('request'),
fs = require('fs'),
unzip = require('unzip'),
_ = require('lodash'),
mkdirp = require('mkdirp');

var node_modules_json = fs.readFileSync("./npm.json");
var json_modules = JSON.parse(node_modules_json);

module.exports = function downloadPackages (count, callback) {
	var npm_json = [];
	console.log(count)
	for(var i = 0; i < count; i++){
		npm_json.push(json_modules.modules[i]);
	}

	_.forEach(npm_json, function(npmItem){
		// console.log(npmItem);
		var package_directory = "./packages/" + npmItem.name;
		// console.log(package_directory.toString());
		mkdirp(package_directory, function(err){
			if(err) console.log(err);
				else {
					//console.log("done")
					var tarfile = package_directory + "/" + npmItem.name + '.tgz';
					//console.log(package_directory + "/" + npmItem.name + '.tgz');
					request(npmItem.tar_url).pipe(fs.createWriteStream(tarfile.toString()));
				}
		});
	});
	callback()


// 	var req = https.get(url);
// 	req.on('response', function(res) {
//     res
//         .pipe(zlib.createGunzip())
//         .pipe(tar.x({path:'./packages/', strip: 1}))
// });

//creates the tgz file but doesent extract contents
//request(url).pipe(fs.createWriteStream('./packages/lodash.tgz'));

}

// module.exports = function calculateChange(totalPayable, cashPaid) {
//   return [50, 20, 10, 5]; // return the expected Array to pass the test
// };