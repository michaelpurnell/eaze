'use strict'

const tar = require('tar'),
fs = require('fs'),
request = require('request'),
_ = require('lodash'),
mkdirp = require('mkdirp'),
fse = require('fs-extra'),
Q = require('q'),
program = require('commander');

//read in the node modules via JSON file. This can be replaced with a REST Get call from the NPM API that return JSON if found.
var node_modules_json = fs.readFileSync("./npm.json");
var json_modules = JSON.parse(node_modules_json); //parse the JSON

module.exports = downloadPackages

 function downloadPackages (count, callback) {
	
	var node_modules = [];

	//based on the count, loop through & add the modules to node modules array
	for(var i = 0; i < count; i++){
		node_modules.push(json_modules.modules[i]);
	}

	//loop through each node_module item
	_.forEach(node_modules, function(nmItem){
		
		var package_directory = "./packages/" + nmItem.name; //set the package directory to the node module name
		
		mkdirp(package_directory, function(err){ //make the directory based on node module's name
			if(err){
				console.log("error making directory: ", err);
				callback(err);
			} 
			else {
				request.get(nmItem.tar_url) //call the node tar url to get the tarball and its contents
				.on('error', function(err){
					//console.log("error while streaming request: ", err);
					callback(err);

				}).pipe(tar.x({cwd:package_directory.toString()})) // extract the contents in the the node module's directory
				 .on('finish', function () { //done streaming

			      		copyFromPackage(nmItem.name).then(function(node_module){
			      			console.log('Successfully copied ' + node_module +  ' from /package');
			      			
			      			return removePackage(node_module)
			      		}).then(function(nmName){
			      			console.log('Successfully removed ' + nmName + ' package folder');
							
			      		}).catch(function(err){
			      			//console.log("Error in function ", err);
			      			return err;
			      		})
			    	});
				 
				}
			});
	});
	
	callback(null, count);
}

var copyFromPackage = function(node_module_name){
	return Q.promise(function (resolve, reject){

      //copy the packages from ./{node module name}/package to ./{node module name}
      fse.copy('./packages/'+ node_module_name +'/package', './packages/'+ node_module_name,err => {
  			if (err){
  				reject("copyFromPackage - error copying files:");
  			} 
  			else{
  				//console.log('success copying ' + node_module_name +  ' files');
		  		resolve(node_module_name);
		  	
  			}
		})

	});
}

var removePackage = function(node_module_name)
{	
	return Q.promise(function (resolve, reject){
			//removes ./{node module name}/package
	  		fse.remove('./packages/'+ node_module_name +'/package', err => {
	  				if (err){
	  					reject("removePackage - error remove package folder ");

	  				}else{
	  					resolve(node_module_name);
	  				} 
				})
	});
}

const COUNT = parseInt(process.env.COUNT, 10);

downloadPackages(COUNT, function(err,data){
	//console.log(data);
	if(err){
		console.log("Error in function ", err);
	}else{
		console.log(data);
	}
});