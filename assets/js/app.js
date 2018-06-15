// const async = require("async");

const app = {};
let droppedFiles = false;

function updateFolder (list) {
	
	updatePath();
	
	$folder.empty();
	list.forEach(entry => {
		if (entry.isDir) $folder.append(
			'<div class="dir" title="' + entry.name + '" data-name="' + entry.name + '">' +
				'<i class="fas fa-folder"></i>' +
				entry.name +
			'</div>'
		);
	});
	list.forEach(entry => {
		if (entry.isFile) $folder.append(
			'<div class="file" title="' + entry.name + '" data-name="' + entry.name + '">' +
				'<i class="fas fa-file"></i>' +
				entry.name +
			'</div>'
		);
	});
}

function updatePath () {
	
	var folder = currentVirtualFolder;
	console.log("UPDATE FOLDER", folder.name, folder.navPath)
	
	$pathVirtual.empty();
	var $a = $('<a href="javascript:;">');
	var $span = $('<span class="folder-name">').text(folder.name);
	$pathVirtual.append($a);
	$a.append($span);

	$pathPhysical.empty();
	folder.navPath.forEach(function(name) {
		var $a = $('<a href="javascript:;">');
		var $span = $('<span class="folder-name">').text(name);
		$pathPhysical.append($a);
		$a.append($span);
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
			$parent.find('.name').text(virtualFolder.name).on('click', function () {
				virtualFolder.readDirRoot();
			});
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
			getStats(localFolder.path, function(err, stats) {
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
	bg.style.width = Math.floor(100 - f / t * 100) + '%';
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
	
	$toolbar.on('click', function(e) {
		const classList = e.target.classList;
		switch (true) {
			case classList.contains('js-up'):
				currentVirtualFolder.readDirParent();
			break;
		}
	});
	
	$pathVirtual.on('click', 'a', function(e){
		currentVirtualFolder.readDir('', updateFolder);
	});
	
	$pathPhysical.on('click', 'a', function(e){
		$a = $(this);
		var i = $a.prevAll().length;
		var path = [];
		do {
			path.unshift($pathPhysical.find('a:nth-child('+(i+1)+')').text());
		} while (i--);
		currentVirtualFolder.readDir(path.join('\\'), updateFolder);
	});
	
	currentVirtualFolder.readDir('', updateFolder);
	
	$form.on('click', '.file', function (event) {
		onFolderItemClick.call(this, event.target, false);
	});
	
	$form.on('click', '.dir', function (event) {
		onFolderItemClick.call(this, event.target, true);
	});
	
}

function onFolderItemClick (target, isDir) {
	if (isDir) {
		currentVirtualFolder.readDirChild(target.dataset.name);
		return;
	}
}