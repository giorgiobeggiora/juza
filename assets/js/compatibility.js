function exit(msg) {
	alert("QUIT\n" + msg);
	throw new Error("QUIT\n" + msg);
}

function notSupported(msg) {
	alert("NOT SUPPORTED\n" + msg);
	throw new Error("QUIT\n" + msg);
}

try { eval("()=>{}"); } catch (e) { notSupported("Arrow functions"); }

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

if (!isAdvancedUpload) notSupported ('Drag & Drop upload');

Object_values = o => Object.keys(o).map( k => o[k] );