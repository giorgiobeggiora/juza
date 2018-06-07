class VirtualFolder {
	
	constructor (options) {
		Object.assign(this, options);
		this.space = 0;
		this.spaceUsed = 0;
		this.localFolders = [];
		this.navPath = [];
	}
	
	readDir (path, callback) {
		path = path || "";
		callback = callback || (() => {});
		var list = [];
		var lf = Object_values(this.localFolders);
		var lfLen = lf.length;
		var iTot = 0;
		lf.forEach(function(localFolder, i){
			var absPath = p.join(localFolder.path, path);
			console.log(i, absPath)
			readDir (absPath, function (err, dir) {
				var skipAddToList = false;
				if (err) {
					if (err.code === 'ENOENT') {
						skipAddToList = true;
					} else throw err;
				}
				if (!skipAddToList) {
					list = list.concat(dir);
				}
				if (++iTot === lfLen) callback(list);
			});
		});
	}
	
	readDirChild (dirName) {
		var navPath = this.navPath;
		navPath.push(dirName);
		this.readDir(navPath.join('\\'), this.render);
	}
					
	readDirParent () {
		var navPath = this.navPath;
		if (!navPath.length) return;
		navPath.pop();
		this.readDir(navPath.join('\\'), this.render);
	}

	readDirAbs () {
		
	}
					
	readDirRoot () {
		var navPath = this.navPath;
		navPath.splice(0,navPath.length);
		this.readDir('', this.render);
	}
					
	spaceUsedAdd (q) {
		this.spaceUsed += q;
		sidebarSpaceUpdate(this);
	}
	
	render (...args) {
		updateFolder(...args);
	}
	
}
