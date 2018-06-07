var virtualFolders = {};
var currentVirtualFolder = "";
var $sidebar = $('.sidebar');
var $form = $('.box');
var $folder = $('.folder');

$form.addClass('has-advanced-upload');

function readConfigFiles(callback) {
	async.each(localFolders, function (localFolder, cb) {
		var configPath = localFolder.path + '.juza';
		readFile(configPath, function (data) {
			// TODO: sanitize everything
			
			var folder = JSON.parse(data);
			var virtualFolder = virtualFolders[folder.parent.id];
			delete folder.parent;
			
			localFolder.name = (
				typeof folder.name === "string" ? folder.name : null
			);
			localFolder.space = (
				toBytes(folder.space)
			);
			localFolder.filesize = (
				toBytes(folder.space)
			);
			localFolder.spaceUsed = 0;
			localFolder.spaceUsedAdd = function (q) {
				localFolder.spaceUsed += q;
				sidebarSpaceUpdate(localFolder);
				virtualFolder.spaceUsedAdd(q);
			}
			
			if ( !virtualFolder ) {
				var parent = JSON.parse(data).parent;
				virtualFolder = virtualFolders[parent.id] = parent;
				Object.assign(virtualFolder, {
					space: 0,
					localFolders: [],
					navPath: [],
					readDir: readVirtualFolder.bind(virtualFolder),
					readDirChild: readChildFolder.bind(virtualFolder),
					readDirParent: readParentFolder.bind(virtualFolder),
					readDirAbs: readAbsFolder.bind(virtualFolder),
					readDirRoot: readRootFolder.bind(virtualFolder),
					spaceUsed: 0,
					spaceUsedAdd: function (q) {
						virtualFolder.spaceUsed += q;
						sidebarSpaceUpdate(virtualFolder);
					}
				});
				
				if (!currentVirtualFolder) currentVirtualFolder = virtualFolder;
			}
			
			virtualFolder.space += localFolder.space;
			virtualFolder.localFolders.push(localFolder);
			sidebarSpaceUpdate(virtualFolder);
			cb();
		});
	}, callback);
}
