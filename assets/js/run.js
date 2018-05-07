async.series([
	readConfigFiles,
	StartWatchers,
], app.init);
