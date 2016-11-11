var gulp = require('gulp');
var packageJson = require(__dirname+'/package.json');
var _tasks = [
];

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	// gulp.watch([], _tasks);

	require('child_process').spawn('open',['http://127.0.0.1:8080/']);

});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
