const chokidar = require("chokidar");

function StartWatchers(callback){
	if ( typeof callback !== "function" ) callback = function () {};
	var keys = Object.keys(localFolders);
	var keysLen = keys.length;
	var i = 0;
	keys.forEach(function(key){
		var localFolder = localFolders[key];
		localFolder.watcher = chokidar.watch(localFolder.path, {
		  ignored: /(^|[\/\\])\../,
		  persistent: true,
		  alwaysStat: true,
		})
		.on('ready', function () {
			if (++i === keysLen) callback();
		})
		.on('add', function (path, stats) {
			watcher_add(localFolder, path, stats);
		})
		.on('addDir', function (path, stats) {
			watcher_addDir(localFolder, path, stats);
		})
		.on('change', function (path, stats) {
			watcher_change(localFolder, path, stats);
		})
		.on('unlink', function (path) {
			watcher_unlink(localFolder, path);
		})
		.on('unlinkDir', function (path) {
			watcher_unlinkDir(localFolder, path);
		})
		.on('raw', function (event, path, details) {
			watcher_raw(localFolder, event, path, details);
		})
		.on('error', function (err) {
			watcher_add(localFolder, err);
		});
	});
}

function watcher_add (localFolder, path, stats) {
	console.log(`File ${path} has been added`);
	if (stats) console.log(`File ${path} changed size to ${stats.size}`);
	localFolder.spaceUsedAdd(stats.size);
}

function watcher_addDir (localFolder, path, stats) {
	console.log(`Directory ${path} has been added`);
	if (stats) console.log(`File ${path} changed size to ${stats.size}`);
}

function watcher_change (localFolder, path, stats) {
	console.log(`File ${path} has been changed`);
	if (stats) console.log(`File ${path} changed size to ${stats.size}`);
	localFolder.spaceUsedAdd(stats.size);
}

function watcher_unlink (localFolder, path) {
	console.log(`File ${path} has been removed`);
}

function watcher_unlinkDir (localFolder, path) {
	console.log(`Directory ${path} has been removed`);
}

function watcher_raw (localFolder, event, path, details) {
	console.log(`Raw event info:`, event, path, details);
}

function watcher_error (localFolder, err) {
	console.log(`Watcher error: ${err}`);
}
