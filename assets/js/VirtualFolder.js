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
		var navPath = this.navPath;
		navPath.splice(0, navPath.length, ...path.split("\\"));
		if (navPath[0] === "") navPath.splice(0, 1);
		if (navPath[navPath.length - 1] === "") navPath.splice(-1, 1);
		
		callback = callback || (() => {});
		var lf = Object_values(this.localFolders);
		var list = [];
		async.each(lf, function(localFolder, cb){
			var absPath = p.join(localFolder.path, path);
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
				cb();
			});
		}, function(){
			list.sort((a, b) => {
				var order = a.isDir ? (b.isDir ? 0 : 1) : (b.isDir ? -1 : 0);
				if (!order) order = a.name.localeCompare(b.name, app.lang);
				return order;
			});
			
			callback(list);
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
					
	addLocalFolder (folder) {
		this.space += folder.space;
		this.localFolders.push(folder);
		sidebarSpaceUpdate(this);		
	}
	
	spaceUsedAdd (q) {
		this.spaceUsed += q;
		sidebarSpaceUpdate(this);
	}
	
	render (...args) {
		updateFolder(...args);
	}
	
}
