// const fs = require('fs');
// const p = require('path');

function readDir (path, callback) {
	fs.readdir(path, (err, files) => {
		if (err) {
			callback(err);
			return;
		}
		if (!files) {
			callback (null, []);
			return;
		}
		var index = files.indexOf(".juza");
		if (index !== -1) files.splice(index, 1);
		var list = [];
		async.each(files, function(name, cb) {
			getStats(p.join(path, name), function(err, stats){
				list.push({
					name:name,
					stats:stats,
					isDir:stats.isDirectory(),
					isFile:stats.isFile()
				});
				cb();
			});
		}, function(err){
			callback(null, list);
		});
	});
}

function getStats (path, callback) {
	fs.stat(path, function (err, stats) {
		if (err) {
			callback(err);
			return;
		}
//		stats.isFile()
//		stats.isDirectory()
		callback(null, stats);
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

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function sizeFormat(n, u) {
	var um = ["TB","GB","MB","KB","B"];
	var i = um.length - 1;
	var result = Math.abs(n);
	 while (result >= 1000 || i === 0) {
		result /= 1000;
		i--;
	};
	return toFixed(result, 2) + ' ' + um[i];
}

function fileSizeString(str) {
	var scala = 1000;
	var um = ["B","KB","MB","GB","TB"];
	var re = new RegExp("^(\\d+)(" + um.join("|") + ")$", "i");
	var m = re.exec(str);
	if(!m) return null;
	var n = m[1] * 1;
	if (!Number.isFinite(n)) return null;
	var p = um.indexOf(m[2]);
	if (p < 0) return null;
	return n * Math.pow(scala, p);
}

