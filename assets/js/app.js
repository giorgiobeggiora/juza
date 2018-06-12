// const async = require("async");

const app = {};
let droppedFiles = false;

function updateFolder (list) {
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
	
	currentVirtualFolder.readDir("", updateFolder);
	
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