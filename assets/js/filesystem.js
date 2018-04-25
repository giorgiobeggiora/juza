const fs = require('fs');

function readDir (path, callback) {
	fs.readdir(path, (err, files) => {
		if (err) throw  err;
		var index = files.indexOf(".juza");
		if (index !== -1) files.splice(index, 1);
		var filesLen = files.length;
		var list = new Array(filesLen);
		var iTot = 0;
		files.forEach(function(name, i){
			getStats(path + name, function(stats){
				list[i] = {
					name:name,
					stats:stats,
					isDir:stats.isDirectory(),
					isFile:stats.isFile()
				};
				if (++iTot === filesLen) callback (list);
			});
		});
	});
}

function getStats (path, callback) {
	fs.stat(path, function (err, stats) {
		if (err) throw err;
		stats.isFile()
		stats.isDirectory()
		callback(stats);
	});
}

function isFile(path, callback) {
	stats(path, function (stats) {
		callback(stats.isFile());
	});
}

function isDir(path, callback) {
	stats(path, function (stats) {
		callback(stats.isDirectory());
	});
}

function readFile (path, callback) {
	fs.readFile(path, 'utf8', function (err, data) {
		if (err) throw new Error(err);
		callback(data);
	});
}

function toBytes(s, u) {
	var result = 0;
	if (typeof s === "string") {
		result = +s;
		if (Number.isFinite(result)) return result;
		result = fileSizeString(s);
		if (result !== null) return result;
		return null;
	} else if (Number.isFinite(result) && u && typeof u === "string") {
		return s;
	} else if (s instanceof Stats) {
		return s.size;
	}
	return null;
}

function sizeFormat(s, u) {
	var um = ["TB","GB","MB","KB","B"];
}

function fileSizeString(str) {
	var scala = 1000;
	var um = ["TB","GB","MB","KB","B"];
	var re = new RegExp("^(\\d+)(" + um.join("|") + ")$", "i");
	var m = re.exec(str);
	if(!m) return null;
	var n = m[0] * 1;
	if (!Number.isFinite(n)) return null;
	var p = scala.indexOf(m[1]);
	if (p < 0) return null;
	return n * Math.pow(scala, p);
}

