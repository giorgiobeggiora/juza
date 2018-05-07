const async = require("async");

const app = {};
let droppedFiles = false;

function syncRun (functions, done, step) {
	let i = 0, len = functions.length;
	step = step || function (cb) {cb()};
	(function next () {
		var func = functions[i++];
		if (func) step(function(){func(next)});
		else step(done);
	})();
}

function asyncRun (functions, options) {
	let done = options.done || function () {};
	let step = options.step || function (cb) {cb()};
	let i = 0, len = functions.length;
	functions.forEach(function (func) {
		func(function () {
			if (++i === len) step(done);
			else step();
		});
	});
}

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
			$parent = $(`
			<div class="folder liv-0 folder_${virtualFolder.id}">
				<div class="name"></div>
				<div class="space">
					<div class="space-free"></div>
					<div class="space-used"></div>
					<div class="space-bar"></div>
				</div>
			</div>
			`);
			$parent.find('.name').text(virtualFolder.name);
			$parent.appendTo($sidebar);
		}
		
		Object_values(localFolders).forEach(function(localFolder){
			var $folder = $sidebar.find('.' + localFolder.id);
			if (!$folder.length) {
				$folder = $(`
				<div class="folder liv-1 folder_${localFolder.id}">
					<div class="name"></div>
					<div class="space">
						<div class="space-free"></div>
						<div class="space-used"></div>
						<div class="space-bar"></div>
					</div>
				</div>
				`);
				$folder.appendTo($sidebar);
			}
			getStats(localFolder.path, function(stats) {
				$folder.find('.name').text(localFolder.name);
			});			
			
		});
	});

}

function sidebarSpaceUpdate (folder) {
	var sidebarFolder = document.querySelector('.sidebar .folder_' + folder.id);
	if (!sidebarFolder) {
		setTimeout(function(){sidebarSpaceUpdate(folder)}, 0);
		return;
	}
	var used = sidebarFolder.querySelector('.space-used');
	var free = sidebarFolder.querySelector('.space-free');
	var u = folder.spaceUsed;
	var t = folder.space;
	var f = folder.space - folder.spaceUsed;
	used.textContent = sizeFormat(u);
	free.textContent = sizeFormat(f);
	var bg = sidebarFolder.querySelector('.space-bar');
	bg.style.width = Math.floor((1 - f/t) * 100) + '%';
}

app.init = function (err, results) {
	
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
			if (entry.isDir) $folder.append(
				'<div class="dir">' +
					'<i class="fas fa-folder"></i>' +
					entry.name +
				'</div>'
			);
		});
		list.forEach(entry => {
			if (entry.isFile) $folder.append(
				'<div class="file">' +
					'<i class="fas fa-file"></i>' +
					entry.name +
				'</div>'
			);
		});
	});
}
