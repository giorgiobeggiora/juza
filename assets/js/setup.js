var virtualFolders = {};
var currentVirtualFolder = "";
var $sidebar = $('.sidebar');
var $form = $('.box');
var $folder = $('.folder');

$form.addClass('has-advanced-upload');

function readConfigFiles(callback) {
	if ( typeof callback !== "function" ) callback = function () {};
	var keys = Object.keys(localFolders);
	var keysLen = keys.length;
	var i = 0;
	function readNextConfigFile () {
		var id = keys[i];
		var localFolder = localFolders[id];
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
			
			if ( !virtualFolder ) {
				var parent = JSON.parse(data).parent;
				virtualFolder = virtualFolders[parent.id] = parent;
				virtualFolder.localFolders = [];
				virtualFolder.readDir = readVirtualFolder.bind(virtualFolder);
				if (!currentVirtualFolder) currentVirtualFolder = virtualFolder;
			}
			
			virtualFolder.localFolders.push(localFolder);
			if (++i < keysLen) readNextConfigFile()
			else callback(virtualFolders);
			
		});
	}
	readNextConfigFile();
}
