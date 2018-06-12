class LocalFolder {
	
	constructor (options) {
		
		const {id, name, space, filesize, parent, path} = options;
		
		if (!isGoodString(id)) throw new Error("LocalFolder must have an id");
		if (!isGoodString(name)) throw new Error("LocalFolder must have a name");
		if (!isGoodString(path)) throw new Error("LocalFolder must have a path");
		
		this.id = id;
		this.name = name;
		this.path = path;
		this.space = toBytes(space);
		this.filesize = toBytes(filesize);
		
		if (parent) {
			this.parentId = isGoodString(parent.id);
//			this.parentName = isGoodString(parent.name);
		} else {
			this.parentId = null;
//			this.parentName = null;
		}

		this.spaceUsed = 0;
	
	}
	
	spaceUsedAdd (q) {
		if (!Number.isFinite(q)) throw new Error("LocalFolder.spaceUsedAdd() param must be a finite number");
		this.spaceUsed += q;
		sidebarSpaceUpdate(this);
		const virtualFolder = virtualFolders[this.parentId];
		virtualFolder.spaceUsedAdd(q);
	}
	
}