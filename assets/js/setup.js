var localFolders = {};
var virtualFolders = {};
var currentVirtualFolder = "";
var $toolbar = $('#toolbar');
var $sidebar = $('#sidebar');
var $form = $('#box');
var $folder = $('#folder');
var $pathVirtual = $('#path-virtual');
var $pathPhysical = $('#path-physical');

$form.addClass('has-advanced-upload');

function readConfigFiles(callback) {
	async.each(config.localFolders, function (folder, cb) {
		var configPath = p.join(folder.path, '.juza');
		readFile(configPath, function (jsonStr) {
			
			var json = Object.assign(JSON.parse(jsonStr), {path: folder.path});
			var localFolder = localFolders[json.id] = new LocalFolder(json);
			
			var parentId = localFolder.parentId;
			var virtualFolder = parentId ? virtualFolders[parentId] : null;
			if ( !virtualFolder ) {
				var parent = json.parent;
				virtualFolder = virtualFolders[parent.id] = new VirtualFolder(parent);
				if (!currentVirtualFolder) currentVirtualFolder = virtualFolder;
			}

			virtualFolder.addLocalFolder(localFolder);
			cb();
			
		});
	}, callback);
}
