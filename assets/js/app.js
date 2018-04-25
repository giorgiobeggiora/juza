var app = {};
var droppedFiles = false;

/*
function getLocalFoldersPaths() {
	return Object.keys(localFolders).map(function(id){
		return localFolders[id].path;
	});
}
*/

function readVirtualFolder (p, callback) {
	p = p || "";
	callback = callback || (() => {});
	var list = [];
	var lf = Object_values(this.localFolders);
	var lfLen = lf.length;
	var iTot = 0;
	lf.forEach(function(localFolder, i){
		var path = localFolder.path + p;
		try { readDir (path, function (dir) {
			list = list.concat(dir);
			if (++iTot === lfLen) callback(list);
		}); } catch (e) {
			if (++iTot === lfLen) callback(list);
		}
	});
}

function updateSidebar () {
	Object_values(virtualFolders).forEach(function(virtualFolder){
		
		var $parent = $sidebar.find('.' + virtualFolder.id);
		if (!$parent.length) {
			$parent = $('<div class="folder liv-0 ' + virtualFolder.id + '"></div>');
			$parent.html(virtualFolder.name);
			$parent.appendTo($sidebar);
		}
		
		Object_values(localFolders).forEach(function(localFolder){
			var $folder = $sidebar.find('.' + localFolder.id);
			if (!$folder.length) {
				$folder = $('<div class="folder liv-1 ' + localFolder.id + '"></div>');
				$folder.appendTo($sidebar);
			}
			getStats(localFolder.path, function(stats) {
				$folder.html(localFolder.name);
			});			
			
		});
	});

}

app.init = function () {
	
	updateSidebar();
	
	$form
	.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
		e.preventDefault();
		e.stopPropagation();
	})
	.on('dragover dragenter', function() {
		$form.addClass('is-dragover');
	})
	.on('dragleave dragend drop', function(event) {
		$form.removeClass('is-dragover');
	})
	.on('drop', function(e) {
		droppedFiles = e.originalEvent.dataTransfer.files;
		console.log(droppedFiles)
	});
	
	currentVirtualFolder.readDir("", list => {
		$folder.empty();
		list.forEach(entry => {
			if (entry.isDir) $folder.append('<div>[D] '+entry.name+'</div>')
		});
		list.forEach(entry => {
			if (entry.isFile) $folder.append('<div>[F] '+entry.name+'</div>')
		});
	});
}
